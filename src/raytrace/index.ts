import { Camera } from './camera';
import { scene1, scene2, scene3 } from './scene';

const main = async () => {
    // Html5 Canvas our beloved
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const scene = scene3();

    // Setup camera
    const camera = new Camera(
        {
            imageWidth: 64,
            aspectRatio: window.innerWidth / window.innerHeight,
            samplesPerPixel: 100,
            maxDepth: 50,
        },
        scene.cameraOptions,
    );

    // Use raw image to batch upload to the canvas
    canvas.width = camera.imageWidth;
    canvas.height = camera.imageHeight;
    const imageData = ctx.createImageData(camera.imageWidth, camera.imageHeight);

    await camera.render(scene.world, imageData.data);

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

await main();
