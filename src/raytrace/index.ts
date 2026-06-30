import { Camera } from './camera';
import { HittableList, Sphere } from './hittable';
import { Vec3 } from './util';

const world = new HittableList([new Sphere(new Vec3(0, 0, -1), 0.5), new Sphere(new Vec3(0, -100.5, -1), 100)]);

const main = () => {
    // Html5 Canvas our beloved
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Setup camera
    const camera = new Camera(400, window.innerWidth / window.innerHeight);
    canvas.width = camera.imageWidth;
    canvas.height = camera.imageHeight;

    // Use raw image to batch upload to the canvas
    const imageData = ctx.createImageData(camera.imageWidth, camera.imageHeight);
    camera.render(world, imageData.data);
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
