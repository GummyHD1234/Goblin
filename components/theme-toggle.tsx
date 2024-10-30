"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="default"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5 mr-2" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 mr-2" />
          Dark Mode
        </>
      )}
    </Button>
  );
}