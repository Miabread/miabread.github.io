import { type CameraSceneOptions } from './camera';
import { HittableList, Sphere } from './hittable';
import { Dielectric, Lambert, Metal } from './material';
import { Vec3 } from './util';

class Scene {
    constructor(
        public world: HittableList,
        public cameraOptions: CameraSceneOptions,
    ) {}
}

export const scene1 = () => {
    const materialGround = new Lambert(new Vec3(0.8, 0.8, 0.0));
    const materialCenter = new Lambert(new Vec3(0.1, 0.2, 0.5));
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

    const materialLeft = new Lambert(new Vec3(0, 0, 1));
    const materialRight = new Lambert(new Vec3(1, 0, 0));

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
