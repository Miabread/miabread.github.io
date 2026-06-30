import { Ray, type Hittable } from './hittable';
import { Interval, Vec3, type Point3 } from './util';

export class Camera {
    public imageHeight: number;
    private center: Point3;
    private upperLeftPixelLocation: Point3;
    private pixelDeltaU: Vec3;
    private pixelDeltaV: Vec3;

    constructor(
        public imageWidth: number,
        aspectRatio: number,
    ) {
        this.imageHeight = Math.max(1, Math.trunc(this.imageWidth / aspectRatio));

        const focalLength = 1.0;
        const viewportHeight = 2.0;
        const viewportWidth = viewportHeight * (this.imageWidth / this.imageHeight);
        this.center = Vec3.zero;

        const viewportU = new Vec3(viewportWidth, 0, 0);
        const viewportV = new Vec3(0, -viewportHeight, 0);

        this.pixelDeltaU = viewportU.div(this.imageWidth);
        this.pixelDeltaV = viewportV.div(this.imageHeight);

        const viewportUpperLeft = this.center
            .minus(new Vec3(0, 0, focalLength))
            .minus(viewportU.div(2))
            .minus(viewportV.div(2));

        this.upperLeftPixelLocation = viewportUpperLeft
            .plus(this.pixelDeltaU.times(0.5))
            .plus(this.pixelDeltaV.times(0.5));
    }

    public render(world: Hittable, data: ImageDataArray) {
        for (let j = 0; j < this.imageHeight; j++) {
            for (let i = 0; i < this.imageWidth; i++) {
                const pixelCenter = this.upperLeftPixelLocation
                    .plus(this.pixelDeltaU.times(i))
                    .plus(this.pixelDeltaV.times(j));
                const rayDirection = pixelCenter.minus(this.center);
                const r = new Ray(this.center, rayDirection);
                const pixelColor = this.rayColor(r, world);

                const index = (j * this.imageWidth + i) * 4;
                data[index + 0] = Math.floor(pixelColor.r * 255.999);
                data[index + 1] = Math.floor(pixelColor.g * 255.999);
                data[index + 2] = Math.floor(pixelColor.b * 255.999);
                data[index + 3] = 255;
            }
        }
    }

    private rayColor(r: Ray, world: Hittable) {
        const rec = world.hit(r, new Interval(0, Infinity));
        if (rec) {
            return rec.normal.plus(1).times(0.5);
        }

        const unitDirection = r.direction.unitVector;
        const a = 0.5 * (unitDirection.y + 1.0);
        return new Vec3(1.0, 1.0, 1.0).times(1.0 - a).plus(new Vec3(0.5, 0.7, 1.0).times(a));
    }
}
