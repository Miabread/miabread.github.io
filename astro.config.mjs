// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
    site: 'https://miabread.github.io/',
    vite: {
        plugins: [
            tailwindcss(),
            visualizer({
                emitFile: true,
                filename: 'stats.html',
            }),
        ],
    },
    integrations: [icon()],
});
