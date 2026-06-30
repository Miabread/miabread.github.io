import { Ray, Vec3, type Point3 } from './vec3';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

const hitSphere = (center: Point3, radius: number, r: Ray) => {
    const oc = center.minus(r.origin);

    // Quadratic formula to solve vector-based sphere equation x^2+y^2+z^2=r^2
    const a = r.direction.dot(r.direction);
    const b = -2.0 * r.direction.dot(oc);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return -1.0;
    }

    return (-b - Math.sqrt(discriminant)) / (2.0 * a);
};

const rayColor = (r: Ray) => {
    const center = new Vec3(0, 0, -1);
    const t = hitSphere(center, 0.5, r);
    if (t > 0.0) {
        const N = r.at(t).minus(center).unitVector;
        return N.plus(1).times(0.5);
    }

    const unitDirection = r.direction.unitVector;
    const a = 0.5 * (unitDirection.y + 1.0);
    return new Vec3(1.0, 1.0, 1.0).times(1.0 - a).plus(new Vec3(0.5, 0.7, 1.0).times(a));
};

const main = () => {
    // Image math
    const aspectRatio = window.innerWidth / window.innerHeight;
    const imageWidth = 400;
    const imageHeight = Math.max(1, Math.trunc(imageWidth / aspectRatio));
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Use raw image to batch upload to the canvas
    const imageData = ctx.createImageData(imageWidth, imageHeight);
    const data = imageData.data;

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
            const pixelColor = rayColor(r);

            const index = (j * imageWidth + i) * 4;
            data[index + 0] = Math.floor(pixelColor.x * 255.999);
            data[index + 1] = Math.floor(pixelColor.y * 255.999);
            data[index + 2] = Math.floor(pixelColor.z * 255.999);
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
