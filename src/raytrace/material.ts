import { Ray, type HitRecord } from './hittable';
import { Vec3, type Color3 } from './util';

export class MaterialRecord {
    constructor(
        public attenuation: Color3,
        public scattered: Ray,
    ) {}
}

export abstract class Material {
    public abstract scatter(r_in: Ray, rec: HitRecord): MaterialRecord | null;
}

export class Lambert extends Material {
    constructor(private albedo: Color3) {
        super();
    }

    public override scatter(r_in: Ray, rec: HitRecord): MaterialRecord | null {
        let scatterDirection = rec.normal.plus(Vec3.randomUnitVector());

        if (scatterDirection.nearZero) {
            scatterDirection = rec.normal;
        }

        return new MaterialRecord(this.albedo, new Ray(rec.p, scatterDirection));
    }
}

export class Metal extends Material {
    constructor(private albedo: Color3) {
        super();
    }

    public override scatter(r_in: Ray, rec: HitRecord): MaterialRecord | null {
        const reflected = r_in.direction.reflect(rec.normal);

        return new MaterialRecord(this.albedo, new Ray(rec.p, reflected));
    }
}
