'use client'

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminSidebar, AdminView } from "./sidebar";
import { AdminLogin } from "./login";
import { Dashboard } from "./dashboard";
import { PostsManager } from "./posts-manager";
import { CategoriesManager } from "./categories-manager";
import { AuthorsManager } from "./authors-manager";
import { SubscribersManager } from "./subscribers-manager";
import { CommentsManager } from "./comments-manager";
import { Category, Author } from "@/lib/types";

interface AdminPanelProps {
  onExit: () => void;
}

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [view, setView] = useState<AdminView>("dashboard");
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/admin/check")
      .then((res) => res.json())
      .then((data) => setAuthed(data.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  // Load categories & authors when authed
  useEffect(() => {
    if (!authed) return;

    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/authors").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ])
      .then(([catsData, authorsData, statsData]) => {
        setCategories(catsData.categories || []);
        setAuthors(authorsData.authors || []);
        setStats(statsData.stats);
      })
      .catch(() => {});
  }, [authed]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setAuthed(false);
      onExit();
    } catch {
      // ignore
    }
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!authed) {
    return (
      <AdminLogin
        onBack={onExit}
        onSuccess={() => setAuthed(true)}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/20" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar
        currentView={view}
        onViewChange={setView}
        onLogout={handleLogout}
        onExitToBlog={onExit}
        stats={stats}
      />

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 md:px-8 py-8">
          {view === "dashboard" && <Dashboard onNavigate={setView} />}
          {view === "posts" && (
            <PostsManager categories={categories} authors={authors} />
          )}
          {view === "categories" && <CategoriesManager />}
          {view === "authors" && <AuthorsManager />}
          {view === "subscribers" && <SubscribersManager />}
          {view === "comments" && <CommentsManager onPostClick={() => {}} />}
        </div>
      </main>
    </div>
  );
}
