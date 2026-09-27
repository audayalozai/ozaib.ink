'use client'

import { useState } from "react";
import { Search, Menu, X, Moon, Sun, Feather, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { CategoryIcon } from "@/components/blog/category-icon";
import { Category } from "@/lib/types";

interface HeaderProps {
  categories: Category[];
  onHomeClick: () => void;
  onCategoryClick: (categoryId: string) => void;
  onSearch: (query: string) => void;
  onAdvancedSearch: () => void;
  onAboutClick: () => void;
}

export function Header({
  categories,
  onHomeClick,
  onCategoryClick,
  onSearch,
  onAdvancedSearch,
  onAboutClick,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 group"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-foreground text-background">
              <Feather className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              ozaib<span className="text-accent">.ink</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onHomeClick}
              className="text-foreground"
            >
              الرئيسية
            </Button>
            {categories.slice(0, 5).map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                size="sm"
                onClick={() => onCategoryClick(cat.id)}
                className="text-foreground hover:text-accent gap-1.5"
              >
                <CategoryIcon icon={cat.icon} size={14} />
                {cat.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAdvancedSearch}
              className="text-foreground hover:text-accent gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              بحث متقدم
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAboutClick}
              className="text-foreground"
            >
              عن المدونة
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-9 w-9"
              aria-label="بحث"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="تبديل السمة"
              suppressHydrationWarning
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-9 w-9"
              aria-label="القائمة"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="pb-4">
            <Input
              autoFocus
              type="search"
              placeholder="ابحث في المقالات..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full"
            />
          </form>
        )}
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Button
              variant="ghost"
              onClick={() => {
                onHomeClick();
                setMobileOpen(false);
              }}
              className="justify-start"
            >
              الرئيسية
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                onClick={() => {
                  onCategoryClick(cat.id);
                  setMobileOpen(false);
                }}
                className="justify-start"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full ml-2"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                onAdvancedSearch();
                setMobileOpen(false);
              }}
              className="justify-start"
            >
              <SlidersHorizontal className="h-4 w-4 ml-2" />
              بحث متقدم
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onAboutClick();
                setMobileOpen(false);
              }}
              className="justify-start"
            >
              عن المدونة
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
