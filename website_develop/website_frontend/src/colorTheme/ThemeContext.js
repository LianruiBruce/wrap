// ThemeContext.js
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("colorMode") || "light"
  );

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
