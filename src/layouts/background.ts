import { Interval, Ray, Vec3, type Point3 } from './vec3';

class HitRecord {
    public normal: Vec3;
    public frontFace: boolean;

    constructor(
        public t: number,
        public p: Point3,

        r: Ray,
        outwardNormal: Vec3,
    ) {
        this.frontFace = r.direction.dot(outwardNormal) < 0;
        this.normal = this.frontFace ? outwardNormal : outwardNormal.neg;
    }
}

abstract class Hittable {
    public abstract hit(r: Ray, rayT: Interval): HitRecord | null;
}

class Sphere extends Hittable {
    constructor(
        public center: Point3,
        public radius: number,
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

        return new HitRecord(t, p, r, outwardNormal);
    }
}

class HittableList extends Hittable {
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

const hitSphere = (center: Point3, radius: number, r: Ray) => {
    const oc = center.minus(r.origin);

    // Heavily optimized code version of using the quadratic formula to solve sphere equation x^2+y^2+z^2=r^2 using vectors
    const a = r.direction.lengthSquared;
    const h = r.direction.dot(oc);
    const c = oc.lengthSquared - radius * radius;
    const discriminant = h * h - a * c;

    if (discriminant < 0) {
        return -1.0;
    }

    return (h - Math.sqrt(discriminant)) / a;
};

const rayColor = (r: Ray, world: Hittable) => {
    const rec = world.hit(r, new Interval(0, Infinity));
    if (rec) {
        return rec.normal.plus(1).times(0.5);
    }

    const unitDirection = r.direction.unitVector;
    const a = 0.5 * (unitDirection.y + 1.0);
    return new Vec3(1.0, 1.0, 1.0).times(1.0 - a).plus(new Vec3(0.5, 0.7, 1.0).times(a));
};

const main = () => {
    // Html5 Canvas our beloved
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Image math
    const aspectRatio = window.innerWidth / window.innerHeight;
    const imageWidth = 400;
    const imageHeight = Math.max(1, Math.trunc(imageWidth / aspectRatio));
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Use raw image to batch upload to the canvas
    const imageData = ctx.createImageData(imageWidth, imageHeight);
    const data = imageData.data;

    // World
    const world = new HittableList([new Sphere(new Vec3(0, 0, -1), 0.5), new Sphere(new Vec3(0, -100.5, -1), 100)]);

    // Camera math
    const focalLength = 1.0;
    const viewportHeight = 2.0;
    const viewportWidth = viewportHeight * (imageWidth / imageHeight);
    const cameraCenter = Vec3.zero;

    const viewportU = new Vec3(viewportWidth, 0, 0);
    const viewportV = new Vec3(0, -viewportHeight, 0);

    const pixelDeltaU = viewportU.div(imageWidth);
    const pixelDeltaV = viewportV.div(imageHeight);

    const viewportUpperLeft = cameraCenter
        .minus(new Vec3(0, 0, focalLength))
        .minus(viewportU.div(2))
        .minus(viewportV.div(2));
    const upperLeftPixelLocation = viewportUpperLeft.plus(pixelDeltaU.times(0.5)).plus(pixelDeltaV.times(0.5));

    // Render each ray
    for (let j = 0; j < imageHeight; j++) {
        for (let i = 0; i < imageWidth; i++) {
            const pixelCenter = upperLeftPixelLocation.plus(pixelDeltaU.times(i)).plus(pixelDeltaV.times(j));
            const rayDirection = pixelCenter.minus(cameraCenter);
            const r = new Ray(cameraCenter, rayDirection);
            const pixelColor = rayColor(r, world);

            const index = (j * imageWidth + i) * 4;
            data[index + 0] = Math.floor(pixelColor.r * 255.999);
            data[index + 1] = Math.floor(pixelColor.g * 255.999);
            data[index + 2] = Math.floor(pixelColor.b * 255.999);
            data[index + 3] = 255;
        }
    }

    // Render the image to the background
    ctx.putImageData(imageData, 0, 0);
    document.querySelector('body')!.style.backgroundImage = `url(${canvas.toDataURL()})`;

    // Color debug tool cause this sphere won't stop being greyed out
    document.addEventListener('click', (event) => {
        const x = Math.floor((event.clientX / window.innerWidth) * imageWidth);
        const y = Math.floor((event.clientY / window.innerHeight) * imageHeight);

        const pixel = ctx.getImageData(x, y, 1, 1).data;

        console.log(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
    });
};

main();
