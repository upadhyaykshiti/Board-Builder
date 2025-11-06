

// src/components/layout/ThemeProvider.jsx
import React, { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen transition-colors duration-500 font-sans bg-[var(--bg)] text-[var(--text)]">
        <header className="flex justify-end p-4 border-b border-[var(--border)] backdrop-blur-md">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </ThemeContext.Provider>
  );
};
