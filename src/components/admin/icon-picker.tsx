'use client'

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON, ICON_NAMES } from "@/lib/category-icons";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const CurrentIcon = (value && CATEGORY_ICONS[value]) || DEFAULT_CATEGORY_ICON;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between h-12"
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-white"
              style={{ backgroundColor: "var(--accent, #d97706)" }}
            >
              <CurrentIcon size={16} />
            </span>
            <span className="text-sm font-medium">
              {value || "اختر أيقونة"}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-3"
        align="start"
        sideOffset={4}
      >
        <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
          اختر أيقونة للتصنيف ({ICON_NAMES.length} متاحة)
        </div>
        <div className="grid grid-cols-6 gap-1.5 max-h-72 overflow-y-auto">
          {ICON_NAMES.map((iconName) => {
            const Icon = CATEGORY_ICONS[iconName];
            const isSelected = value === iconName;
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  onChange(iconName);
                  setOpen(false);
                }}
                className={`relative aspect-square flex items-center justify-center rounded-lg border transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50 hover:bg-muted"
                }`}
                title={iconName}
                aria-label={iconName}
              >
                <Icon size={18} />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full p-0.5">
                    <Check size={10} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
