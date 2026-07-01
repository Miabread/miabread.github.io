import { Camera } from './camera';
import { HittableList, Sphere } from './hittable';
import { Dielectric, Lambert, Metal } from './material';
import { Vec3 } from './util';

const world = () => {
    const materialGround = new Lambert(new Vec3(0.8, 0.8, 0.0));
    const materialCenter = new Lambert(new Vec3(0.1, 0.2, 0.5));
    const materialLeft = new Dielectric(1.5);
    const materialBubble = new Dielectric(1.0 / 1.5);
    const materialRight = new Metal(new Vec3(0.8, 0.6, 0.2), 1.0);

    return new HittableList([
        new Sphere(new Vec3(0.0, -100.5, -1.0), 100.0, materialGround),
        new Sphere(new Vec3(0.0, 0.0, -1.2), 0.5, materialCenter),
        new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.5, materialLeft),
        new Sphere(new Vec3(-1.0, 0.0, -1.0), 0.4, materialBubble),
        new Sphere(new Vec3(1.0, 0.0, -1.0), 0.5, materialRight),
    ]);
};

const world2 = () => {
    const R = Math.cos(Math.PI / 4);

    const materialLeft = new Lambert(new Vec3(0, 0, 1));
    const materialRight = new Lambert(new Vec3(1, 0, 0));

    return new HittableList([
        new Sphere(new Vec3(-R, 0, -1), R, materialLeft),
        new Sphere(new Vec3(R, 0, -1), R, materialRight),
    ]);
};

const main = () => {
    // Html5 Canvas our beloved
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Setup camera
    const camera = new Camera({
        imageWidth: 400,
        aspectRatio: window.innerWidth / window.innerHeight,
        samplesPerPixel: 100,
        maxDepth: 50,

        verticalFov: 20,
        lookFrom: new Vec3(-2, 2, 1),
        lookAt: new Vec3(0, 0, -1),
        vUp: new Vec3(0, 1, 0),
    });

    // Use raw image to batch upload to the canvas
    canvas.width = camera.imageWidth;
    canvas.height = camera.imageHeight;
    const imageData = ctx.createImageData(camera.imageWidth, camera.imageHeight);

    camera.render(world(), imageData.data);

    ctx.putImageData(imageData, 0, 0);
    document.querySelector('body')!.style.backgroundImage = `url(${canvas.toDataURL()})`;

    // Color debug tool cause this sphere won't stop being greyed out
    document.addEventListener('click', (event) => {
        const x = Math.floor((event.clientX / window.innerWidth) * camera.imageWidth);
        const y = Math.floor((event.clientY / window.innerHeight) * camera.imageHeight);

        const pixel = ctx.getImageData(x, y, 1, 1).data;

        console.log(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
    });
};

main();
