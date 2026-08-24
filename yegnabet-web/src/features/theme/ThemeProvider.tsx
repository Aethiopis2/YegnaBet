import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeProvider = ({children} : ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem("yegna-theme") as Theme | null;

        if (stored == "light" || stored == "dark") return stored;

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark" : "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("yegna-theme", theme);
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        setTheme: (nextTheme: Theme) => { setThemeState(nextTheme);},
        toggleTheme: () => {
            setThemeState((current) => current === "light" ? "dark" : "light");
        }
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider