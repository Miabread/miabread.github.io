import { createEffect, createSignal } from 'solid-js';
import IconThemeSystem from '~icons/mdi/theme-light-dark';
import IconThemeDark from '~icons/mdi/weather-night';
import IconThemeLight from '~icons/mdi/weather-sunny';

const themes = {
    system: {
        icon: <IconThemeSystem />,
        next: 'dark',
    },
    dark: {
        icon: <IconThemeDark />,
        next: 'light',
    },
    light: {
        icon: <IconThemeLight />,
        next: 'system',
    },
} as const;

export const ThemePicker = () => {
    const [theme, setTheme] = createSignal((localStorage.getItem('theme') as keyof typeof themes) ?? 'system');

    createEffect(() => {
        localStorage.setItem('theme', theme());

        const darkThemeEnabled =
            theme() === 'dark' || (theme() === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList.toggle('dark', darkThemeEnabled);
    });

    return <button onClick={() => setTheme(themes[theme()].next)}>{themes[theme()].icon}</button>;
};
