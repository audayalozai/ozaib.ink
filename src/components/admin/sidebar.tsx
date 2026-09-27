'use client'

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Mail,
  LogOut,
  Feather,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type AdminView =
  | "dashboard"
  | "posts"
  | "categories"
  | "authors"
  | "subscribers"
  | "comments";

interface SidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  onLogout: () => void;
  onExitToBlog: () => void;
  stats: {
    totalPosts: number;
    totalCategories: number;
    totalAuthors: number;
    totalSubscribers: number;
    pendingComments?: number;
  } | null;
}

interface NavItem {
  id: AdminView;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

export function AdminSidebar({
  currentView,
  onViewChange,
  onLogout,
  onExitToBlog,
  stats,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "الرئيسية",
      icon: LayoutDashboard,
    },
    {
      id: "posts",
      label: "المقالات",
      icon: FileText,
      badge: stats?.totalPosts,
    },
    {
      id: "categories",
      label: "التصنيفات",
      icon: FolderTree,
      badge: stats?.totalCategories,
    },
    {
      id: "authors",
      label: "الكُتّاب",
      icon: Users,
      badge: stats?.totalAuthors,
    },
    {
      id: "subscribers",
      label: "المشتركون",
      icon: Mail,
      badge: stats?.totalSubscribers,
    },
    {
      id: "comments",
      label: "التعليقات",
      icon: MessageSquare,
      badge: stats?.pendingComments,
    },
  ];

  const sidebar = (
    <aside className="w-64 bg-card border-l border-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-foreground text-background">
            <Feather className="h-5 w-5" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold text-foreground">
              ozaib<span className="text-accent">.ink</span>
            </div>
            <div className="text-xs text-muted-foreground">لوحة التحكم</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          onClick={onExitToBlog}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          عرض المدونة
        </Button>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-foreground text-background">
            <Feather className="h-4 w-4" />
          </div>
          <span className="font-serif font-bold text-foreground">
            ozaib<span className="text-accent">.ink</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-9 w-9"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 mr-auto h-full">{sidebar}</div>
        </div>
      )}
    </>
  );
}
