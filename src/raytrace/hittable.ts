import type { Material } from './material';
import { type Point3, BoundingBox, Interval, Vec3 } from './util';

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
    public boundingBox = BoundingBox.empty;

    public abstract hit(r: Ray, rayT: Interval): HitRecord | null;
}

export class Sphere extends Hittable {
    constructor(
        public center: Point3,
        public radius: number,
        public mat: Material,
    ) {
        super();
        const radiusVec = Vec3.of(this.radius);
        this.boundingBox = BoundingBox.corners(this.center.minus(radiusVec), this.center.plus(radiusVec));
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
    private objects: Hittable[] = [];

    constructor(objects: Hittable[] = []) {
        super();
        for (const object of objects) {
            this.add(object);
        }
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

    public add(object: Hittable): HittableList {
        this.objects.push(object);
        this.boundingBox = this.boundingBox.join(object.boundingBox);
        return this;
    }

    public toBVH() {
        return new BoundingVolumeHierarchy(this.objects);
    }
}

export class BoundingVolumeHierarchy extends Hittable {
    private left: Hittable;
    private right: Hittable;

    constructor(objects: Hittable[]) {
        super();

        for (const object of objects) {
            this.boundingBox = this.boundingBox.join(object.boundingBox);
        }

        const axis = this.boundingBox.longestAxis();

        if (objects.length === 1) {
            this.left = this.right = objects[0];
        } else if (objects.length == 2) {
            this.left = objects[0];
            this.right = objects[1];
        } else {
            objects.sort((a, b) => a.boundingBox.index(axis).min - b.boundingBox.index(axis).min);
            const mid = Math.floor(objects.length / 2);
            this.left = new BoundingVolumeHierarchy(objects.slice(0, mid));
            this.right = new BoundingVolumeHierarchy(objects.slice(mid));
        }
    }

    public hit(r: Ray, rayT: Interval): HitRecord | null {
        if (!this.boundingBox.hit(r, rayT)) {
            return null;
        }

        const hitLeft = this.left.hit(r, rayT);
        const hitRight = this.right.hit(r, new Interval(rayT.min, hitLeft ? hitLeft.t : rayT.max));

        return hitRight || hitLeft;
    }
}
