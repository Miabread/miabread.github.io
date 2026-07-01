import { Ray, type Hittable } from './hittable';
import { Interval, Vec3, type Point3 } from './util';

export class Camera {
    public imageWidth: number;
    public imageHeight: number;
    public samplesPerPixel = 100;
    public maxDepth = 50;

    private center: Point3;
    private upperLeftPixelLocation: Point3;
    private pixelDeltaU: Vec3;
    private pixelDeltaV: Vec3;

    constructor(imageWidth: number, aspectRatio: number) {
        this.imageWidth = imageWidth;
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
                let pixelColor = Vec3.zero;

                for (let sample = 0; sample < this.samplesPerPixel; sample++) {
                    const r = this.getRay(i, j);
                    pixelColor = pixelColor.plus(this.rayColor(r, this.maxDepth, world));
                }

                const intensity = new Interval(0.0, 0.999);
                const finalPixelColor = pixelColor
                    .times(1 / this.samplesPerPixel)
                    .map((n) => Math.floor(256 * intensity.clamp(Math.sqrt(n))));

                const index = (j * this.imageWidth + i) * 4;
                data[index + 0] = finalPixelColor.r;
                data[index + 1] = finalPixelColor.g;
                data[index + 2] = finalPixelColor.b;
                data[index + 3] = 255;
            }
        }
    }

    private getRay(i: number, j: number) {
        const offset = this.sampleSquare();
        const pixelSample = this.upperLeftPixelLocation
            .plus(this.pixelDeltaU.times(i + offset.x))
            .plus(this.pixelDeltaV.times(j + offset.y));

        return new Ray(this.center, pixelSample.minus(this.center));
    }

    private sampleSquare() {
        const interval = new Interval(-0.5, 0.5);
        return new Vec3(interval.random(), interval.random(), 0);
    }

    private rayColor(r: Ray, depth: number, world: Hittable): Vec3 {
        if (depth <= 0) {
            return Vec3.zero;
        }

        const hitRecord = world.hit(r, new Interval(0.001, Infinity));
        if (hitRecord) {
            const matRecord = hitRecord.mat.scatter(r, hitRecord);
            if (matRecord) {
                return matRecord.attenuation.times(this.rayColor(matRecord.scattered, depth - 1, world));
            }
            return Vec3.zero;
        }

        const unitDirection = r.direction.unitVector;
        const a = 0.5 * (unitDirection.y + 1.0);
        return new Vec3(1.0, 1.0, 1.0).times(1.0 - a).plus(new Vec3(0.5, 0.7, 1.0).times(a));
    }
}
