'use client'

import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "@/lib/category-icons";

interface CategoryIconProps {
  icon?: string | null;
  className?: string;
  size?: number;
}

export function CategoryIcon({ icon, className = "", size = 24 }: CategoryIconProps) {
  const Icon = (icon && CATEGORY_ICONS[icon]) || DEFAULT_CATEGORY_ICON;
  return (
    <Icon className={className} size={size} />
  );
}
