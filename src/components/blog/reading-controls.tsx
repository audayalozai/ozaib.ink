'use client'

import { useState, useEffect } from "react";
import { Type, Moon, Sun, ZoomIn, ZoomOut, RotateCcw, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FontSize = "small" | "medium" | "large" | "xlarge";
type Theme = "default" | "sepia" | "dark";

const FONT_SIZES: Record<FontSize, { value: string; label: string }> = {
  small: { value: "16px", label: "صغير" },
  medium: { value: "18px", label: "متوسط" },
  large: { value: "20px", label: "كبير" },
  xlarge: { value: "22px", label: "ضخم" },
};

const THEMES: Record<Theme, { label: string; bg: string; fg: string; muted: string } > = {
  default: { label: "افتراضي", bg: "var(--background)", fg: "var(--foreground)", muted: "var(--muted-foreground)" },
  sepia: { label: "بني دافئ", bg: "#f5ecd9", fg: "#5b4636", muted: "#8a7355" },
  dark: { label: "داكن", bg: "#1a1a1a", fg: "#e5e5e5", muted: "#9ca3af" },
};

const STORAGE_KEY = "ozaib_reading_settings";

export function ReadingControls() {
  // Initialize state from localStorage if available
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window === "undefined") return "medium";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.fontSize) return settings.fontSize;
      } catch {}
    }
    return "medium";
  });
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.theme) return settings.theme;
      } catch {}
    }
    return "default";
  });

  // Apply settings to DOM and persist
  useEffect(() => {
    const article = document.querySelector(".article-content") as HTMLElement;
    if (article) {
      article.style.fontSize = FONT_SIZES[fontSize].value;
    }

    const themeData = THEMES[theme];
    document.documentElement.style.setProperty("--reading-bg", themeData.bg);
    document.documentElement.style.setProperty("--reading-fg", themeData.fg);
    document.documentElement.style.setProperty("--reading-muted", themeData.muted);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, theme }));
  }, [fontSize, theme]);

  const reset = () => {
    setFontSize("medium");
    setTheme("default");
  };

  const sizes = Object.keys(FONT_SIZES) as FontSize[];
  const themes = Object.keys(THEMES) as Theme[];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-30 bg-foreground text-background rounded-full p-3 shadow-lg hover:scale-105 transition-transform"
        aria-label="إعدادات القراءة"
      >
        {open ? <X className="h-5 w-5" /> : <Settings2 className="h-5 w-5" />}
      </button>

      {/* Control panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-30 bg-card border border-border rounded-xl shadow-xl p-5 w-72">
          <div className="flex items-center gap-2 mb-4">
            <Type className="h-4 w-4 text-accent" />
            <h3 className="font-bold text-sm text-foreground">إعدادات القراءة</h3>
          </div>

          {/* Font size */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              حجم الخط
            </label>
            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => {
                  const idx = sizes.indexOf(fontSize);
                  if (idx > 0) setFontSize(sizes[idx - 1]);
                }}
                disabled={fontSize === "small"}
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <span className="flex-1 text-center text-sm font-medium text-foreground">
                {FONT_SIZES[fontSize].label}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => {
                  const idx = sizes.indexOf(fontSize);
                  if (idx < sizes.length - 1) setFontSize(sizes[idx + 1]);
                }}
                disabled={fontSize === "xlarge"}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Theme */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              لون الخلفية
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    theme === t
                      ? "border-accent"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  style={{
                    backgroundColor: THEMES[t].bg,
                    color: THEMES[t].fg,
                  }}
                >
                  {THEMES[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="w-full text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 ml-2" />
            إعادة التعيين
          </Button>
        </div>
      )}
    </>
  );
}
