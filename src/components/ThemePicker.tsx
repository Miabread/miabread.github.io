import { createEffect, createSignal } from 'solid-js';
import { getTheme as getGlobalTheme, setTheme as setGlobalTheme } from '../scripts/theme';
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
    const [theme, setTheme] = createSignal(getGlobalTheme());

    createEffect(() => {
        setGlobalTheme(theme());
    });

    return <button onClick={() => setTheme(themes[theme()].next)}>{themes[theme()].icon}</button>;
};
