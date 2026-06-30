import type { Material } from './material';
import { type Point3, type Vec3, Interval } from './util';

export class Ray {
    constructor(
        public origin: Point3,
        public direction: Vec3,
    ) {}

    public at(t: number): Point3 {
        return this.origin.plus(this.direction.times(t));
    }
}

export class HitRecord {
    public normal: Vec3;
    public frontFace: boolean;

    constructor(
        public mat: Material,
        public t: number,
        public p: Point3,

        r: Ray,
        outwardNormal: Vec3,
    ) {
        this.frontFace = r.direction.dot(outwardNormal) < 0;
        this.normal = this.frontFace ? outwardNormal : outwardNormal.neg;
    }
}

export abstract class Hittable {
    public abstract hit(r: Ray, rayT: Interval): HitRecord | null;
}

export class Sphere extends Hittable {
    constructor(
        public center: Point3,
        public radius: number,
        public mat: Material,
    ) {
        super();
    }

    public override hit(r: Ray, rayT: Interval): HitRecord | null {
        // Heavily optimized code version of using the quadratic formula to solve sphere equation x^2+y^2+z^2=r^2 using vectors
        const oc = this.center.minus(r.origin);
        const a = r.direction.lengthSquared;
        const h = r.direction.dot(oc);
        const c = oc.lengthSquared - this.radius ** 2;
        const discriminant = h * h - a * c;
        if (discriminant < 0) return null;

        const sqrtD = Math.sqrt(discriminant);

        const root1 = (h - sqrtD) / a;
        const root2 = (h + sqrtD) / a;
        const root = rayT.surrounds(root1) ? root1 : rayT.surrounds(root2) ? root2 : null;
        if (!root) return null;

        const t = root;
        const p = r.at(t);
        const outwardNormal = p.minus(this.center).div(this.radius);

        return new HitRecord(this.mat, t, p, r, outwardNormal);
    }
}

export class HittableList extends Hittable {
    constructor(public objects: Hittable[]) {
        super();
    }

    public hit(r: Ray, rayT: Interval): HitRecord | null {
        let rec = null;
        let closestSoFar = rayT.max;

        for (const object of this.objects) {
            const tempRec = object.hit(r, new Interval(rayT.min, closestSoFar));
            if (tempRec) {
                rec = tempRec;
                closestSoFar = tempRec.t;
            }
        }

        return rec;
    }
}
