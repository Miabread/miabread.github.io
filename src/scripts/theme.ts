export type Theme = 'system' | 'dark' | 'light';

export const getTheme = () => (localStorage.getItem('theme') ?? 'system') as Theme;

export const setTheme = (theme: Theme) => {
    localStorage.setItem('theme', theme);
    updateTheme();
};

export const updateTheme = () => {
    const darkThemeEnabled =
        getTheme() === 'dark' || (getTheme() === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', darkThemeEnabled);
};
