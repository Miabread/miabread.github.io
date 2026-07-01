import { type CameraSceneOptions } from './camera';
import { BoundingVolumeHierarchy, Hittable, HittableList, Sphere } from './hittable';
import { Dielectric, Lambert, Metal } from './material';
import { Checker, SolidColor } from './texture';
import { Interval, Vec3 } from './util';

class Scene {
    constructor(
        public world: Hittable,
        public cameraOptions: CameraSceneOptions,
    ) {}
}

export const scene1 = () => {
    const materialGround = new Lambert(new SolidColor(new Vec3(0.8, 0.8, 0.0)));
    const materialCenter = new Lambert(new SolidColor(new Vec3(0.1, 0.2, 0.5)));
    const materialLeft = new Dielectric(1.5);
    const materialBubble = new Dielectric(1.0 / 1.5);
    const materialRight = new Metal(new Vec3(0.8, 0.6, 0.2), 1.0);

    return new Scene(
        new HittableList([
            new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0, materialGround),
            new Sphere(new Vec3(0.0, 0.0, -1.2), 0.5, materialCenter),
            new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.5, materialLeft),
            new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.4, materialBubble),
            new Sphere(new Vec3(1.0, 0.0, -1.0), 0.5, materialRight),
        ]),
        {
            verticalFov: 20,
            lookFrom: new Vec3(-2, 2, 1),
            lookAt: new Vec3(0, 0, -1),
            vUp: new Vec3(0, 1, 0),

            defocusAngle: 10.0,
            focusDistance: 3.4,
        },
    );
};

export const scene2 = () => {
    const R = Math.cos(Math.PI / 4);

    const materialLeft = new Lambert(new SolidColor(new Vec3(0, 0, 1)));
    const materialRight = new Lambert(new SolidColor(new Vec3(1, 0, 0)));

    return new Scene(
        new HittableList([
            new Sphere(new Vec3(-R, 0, -1), R, materialLeft),
            new Sphere(new Vec3(R, 0, -1), R, materialRight),
        ]),
        {
            verticalFov: 90,
            lookFrom: new Vec3(0, 0, 0),
            lookAt: new Vec3(0, 0, -1),
            vUp: new Vec3(0, 1, 0),

            defocusAngle: 0,
            focusDistance: 10,
        },
    );
};

const randomMaterial = () => {
    const chooseMaterial = Interval.unit.random();

    if (chooseMaterial < 0.8) {
        const albedo = Vec3.random(Interval.unit).times(Vec3.random(Interval.unit));
        return new Lambert(new SolidColor(albedo));
    } else if (chooseMaterial < 0.95) {
        const albedo = Vec3.random(new Interval(0, 0.5));
        const fuzz = new Interval(0, 0.5).random();
        return new Metal(albedo, fuzz);
    } else {
        return new Dielectric(1.5);
    }
};

export const manySpheres = () => {
    const world = new HittableList([]);

    const groundMaterial = new Lambert(
        new Checker(
            0.32, //
            new SolidColor(new Vec3(0.2, 0.3, 0.1)),
            new SolidColor(new Vec3(0.9, 0.9, 0.9)),
        ),
    );
    world.add(new Sphere(new Vec3(0, -1000, 0), 1000, groundMaterial));

    for (let a = -11; a < 11; a++) {
        for (let b = -11; b < 11; b++) {
            const center = new Vec3(a + 0.9 * Interval.unit.random(), 0.2, b + 0.9 * Interval.unit.random());

            if (center.minus(new Vec3(4, 0.2, 0)).length > 0.9) {
                world.add(new Sphere(center, 0.2, randomMaterial()));
            }
        }
    }

    const material1 = new Dielectric(1.5);
    world.add(new Sphere(new Vec3(0, 1, 0), 1.0, material1));

    const material2 = new Lambert(new SolidColor(new Vec3(0.4, 0.2, 0.1)));
    world.add(new Sphere(new Vec3(-4, 1, 0), 1.0, material2));

    const material3 = new Metal(new Vec3(0.7, 0.6, 0.5), 0.0);
    world.add(new Sphere(new Vec3(4, 1, 0), 1.0, material3));

    return new Scene(world.toBVH(), {
        verticalFov: 20,
        lookFrom: new Vec3(13, 2, 3),
        lookAt: new Vec3(0, 0, 0),
        vUp: new Vec3(0, 1, 0),

        defocusAngle: 0.6,
        focusDistance: 10,
    });
};

export const checkeredSpheres = () => {
    const world = new HittableList([]);

    const checker = new Checker(0.32, new SolidColor(new Vec3(0.2, 0.3, 0.1)), new SolidColor(new Vec3(0.9, 0.9, 0.9)));
    world.add(new Sphere(new Vec3(0, -10, 0), 10, new Lambert(checker)));
    world.add(new Sphere(new Vec3(0, 10, 0), 10, new Lambert(checker)));

    return new Scene(world.toBVH(), {
        verticalFov: 20,
        lookFrom: new Vec3(13, 2, 3),
        lookAt: new Vec3(0, 0, 0),
        vUp: new Vec3(0, 1, 0),

        defocusAngle: 0,
        focusDistance: 10,
    });
};
