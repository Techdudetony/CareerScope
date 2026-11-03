import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = 'careerscope-theme';

const VALID_THEMES = ['light', 'dark', 'system'];

function getSavedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return VALID_THEMES.includes(saved) ? saved : 'system';
    } catch {
        return 'system';
    }
}

function getSystemTheme() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
}

export default function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getSavedTheme);
    const [systemTheme, setSystemTheme] = useState(getSystemTheme);

    const resolvedTheme = theme === 'system'
        ? systemTheme
        : theme;

    useEffect(() => {
        const media = window.matchMedia?.(
            '(prefers-color-scheme: dark)'
        );

        if (!media) return undefined;

        function handleChange(event) {
            setSystemTheme(event.matches ? 'dark' : 'light');
        }

        media.addEventListener('change', handleChange);

        return () => {
            media.removeEventListener('change', handleChange);
        }
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = resolvedTheme;
    }, [resolvedTheme]);

    function updateTheme(nextTheme) {
        if (!VALID_THEMES.includes(nextTheme)) return;

        setTheme(nextTheme);

        try {
            localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
            // Theme remains for this session.
        }
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                setTheme: updateTheme,
            }}
            >
                {children}
            </ThemeContext.Provider>
    );
}