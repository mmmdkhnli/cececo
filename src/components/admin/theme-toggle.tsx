"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminTheme } from "@/components/admin/dark-root";
import { Button } from "@/components/admin/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useAdminTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
