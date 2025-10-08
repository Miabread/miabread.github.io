// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import Icons from 'unplugin-icons/vite';

import solidJs from '@astrojs/solid-js';

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
            Icons({
                compiler: 'solid',
                autoInstall: true,
            }),
        ],
    },
    integrations: [solidJs()],
});
