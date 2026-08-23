"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "dark",
  setTheme: () => {},
});
const PortalContext = createContext<HTMLDivElement | null>(null);

export function useAdminTheme() {
  return useContext(ThemeContext);
}

export function useDarkPortalContainer() {
  return useContext(PortalContext);
}

export function DarkRoot({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("admin-theme");
    if (stored === "light" || stored === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a per-browser preference from localStorage, not derivable during render (SSR has no access to it)
      setThemeState(stored);
    }
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    window.localStorage.setItem("admin-theme", next);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <PortalContext.Provider value={node}>
        <div ref={setNode} className={cn("contents text-foreground", theme)}>
          {children}
        </div>
      </PortalContext.Provider>
    </ThemeContext.Provider>
  );
}
