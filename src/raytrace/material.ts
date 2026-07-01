import { Ray, type HitRecord } from './hittable';
import { Interval, Vec3, type Color3 } from './util';

export class MaterialRecord {
    constructor(
        public attenuation: Color3,
        public scattered: Ray,
    ) {}
}

export abstract class Material {
    public abstract scatter(ray: Ray, rec: HitRecord): MaterialRecord | null;
}

export class Lambert extends Material {
    constructor(private albedo: Color3) {
        super();
    }

    public override scatter(ray: Ray, rec: HitRecord): MaterialRecord | null {
        let scatterDirection = rec.normal.plus(Vec3.randomUnitVector());

        if (scatterDirection.nearZero) {
            scatterDirection = rec.normal;
        }

        return new MaterialRecord(this.albedo, new Ray(rec.p, scatterDirection));
    }
}

export class Metal extends Material {
    constructor(
        private albedo: Color3,
        private fuzz: number,
    ) {
        super();
    }

    public override scatter(ray: Ray, rec: HitRecord): MaterialRecord | null {
        const reflected = ray.direction.reflect(rec.normal);
        const fuzzed = reflected.unitVector.plus(Vec3.randomUnitVector().times(this.fuzz));
        const scattered = new Ray(rec.p, fuzzed);

        if (scattered.direction.dot(rec.normal) > 0) {
            return new MaterialRecord(this.albedo, scattered);
        }

        return null;
    }
}

export class Dielectric extends Material {
    constructor(private refractionIndex: number) {
        super();
    }

    public scatter(ray: Ray, rec: HitRecord): MaterialRecord | null {
        const refractionIndex = rec.frontFace ? 1.0 / this.refractionIndex : this.refractionIndex;

        const unitDirection = ray.direction.unitVector;
        const cosTheta = Math.min(unitDirection.neg.dot(rec.normal), 1.0);
        const sinTheta = Math.sqrt(1.0 - cosTheta ** 2);

        const cannotRefract = refractionIndex * sinTheta > 1.0;

        const direction =
            cannotRefract || this.reflectance(cosTheta) > Interval.unit.random()
                ? unitDirection.reflect(rec.normal)
                : unitDirection.refract(rec.normal, refractionIndex);

        return new MaterialRecord(Vec3.one, new Ray(rec.p, direction));
    }

    private reflectance(cosine: number) {
        const r0 = ((1 - this.refractionIndex) / (1 + this.refractionIndex)) ** 2;
        return r0 + (1 - r0) * (1 - cosine) ** 5;
    }
}
