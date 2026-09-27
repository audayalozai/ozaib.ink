'use client'

import {
  BookOpen,
  Brain,
  Cpu,
  Sparkles,
  Feather,
  Code,
  PenTool,
  Library,
  Globe,
  Heart,
  Lightbulb,
  Microscope,
  Palette,
  Music,
  Camera,
  Film,
  Gamepad2,
  Newspaper,
  GraduationCap,
  Scroll,
  Compass,
  Mountain,
  Coffee,
  Sun,
  Moon,
  Star,
  Zap,
  Globe2,
  Languages,
  Quote,
  BookMarked,
  type LucideIcon,
} from "lucide-react";

// Available icons for categories
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Brain,
  Cpu,
  Sparkles,
  Feather,
  Code,
  PenTool,
  Library,
  Globe,
  Heart,
  Lightbulb,
  Microscope,
  Palette,
  Music,
  Camera,
  Film,
  Gamepad2,
  Newspaper,
  GraduationCap,
  Scroll,
  Compass,
  Mountain,
  Coffee,
  Sun,
  Moon,
  Star,
  Zap,
  Globe2,
  Languages,
  Quote,
  BookMarked,
};

// Default icon if no icon is set or icon name is invalid
export const DEFAULT_CATEGORY_ICON = BookOpen;

// Get icon component by name
export function getCategoryIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return DEFAULT_CATEGORY_ICON;
  return CATEGORY_ICONS[iconName] || DEFAULT_CATEGORY_ICON;
}

// Get list of all available icon names (for admin picker)
export const ICON_NAMES = Object.keys(CATEGORY_ICONS);
