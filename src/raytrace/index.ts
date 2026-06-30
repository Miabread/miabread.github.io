import { Hittable, HittableList, Sphere, Ray } from './hittable';
import { Interval, Vec3 } from './util';

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
    const imageWidth = 64;
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
