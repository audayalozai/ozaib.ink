'use client'

import { useEffect, useState } from "react";
import {
  FileText,
  FolderTree,
  Users,
  Mail,
  TrendingUp,
  Star,
  Eye,
  Loader2,
} from "lucide-react";
import { AdminView } from "./sidebar";

interface DashboardProps {
  onNavigate: (view: AdminView) => void;
}

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  featuredPosts: number;
  totalCategories: number;
  totalAuthors: number;
  totalSubscribers: number;
}

interface PostsPerCategory {
  name: string;
  color: string;
  count: number;
}

interface RecentPost {
  id: string;
  title: string;
  createdAt: string;
  category: { name: string; color: string } | null;
  author: { name: string } | null;
  published: boolean;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [postsPerCategory, setPostsPerCategory] = useState<PostsPerCategory[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setPostsPerCategory(data.postsPerCategory || []);
        setRecentPosts(data.recentPosts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "إجمالي المقالات",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-blue-500",
      view: "posts" as AdminView,
    },
    {
      label: "منشور",
      value: stats.publishedPosts,
      icon: Eye,
      color: "bg-green-500",
      view: "posts" as AdminView,
    },
    {
      label: "مقالات مميزة",
      value: stats.featuredPosts,
      icon: Star,
      color: "bg-amber-500",
      view: "posts" as AdminView,
    },
    {
      label: "التصنيفات",
      value: stats.totalCategories,
      icon: FolderTree,
      color: "bg-purple-500",
      view: "categories" as AdminView,
    },
    {
      label: "الكُتّاب",
      value: stats.totalAuthors,
      icon: Users,
      color: "bg-pink-500",
      view: "authors" as AdminView,
    },
    {
      label: "المشتركون",
      value: stats.totalSubscribers,
      icon: Mail,
      color: "bg-cyan-500",
      view: "subscribers" as AdminView,
    },
  ];

  const maxCount = Math.max(...postsPerCategory.map((c) => c.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          مرحباً بك في لوحة التحكم
        </h1>
        <p className="text-muted-foreground">
          نظرة عامة على نشاط مدونة ozaib.ink
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.view)}
              className="bg-card border border-border rounded-xl p-4 text-right hover:border-accent/50 hover:shadow-md transition-all"
            >
              <div
                className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${card.color} text-white mb-3`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-serif text-2xl font-bold text-foreground">
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {card.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Posts per category */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="font-bold text-foreground">المقالات حسب التصنيف</h2>
          </div>
          {postsPerCategory.length > 0 ? (
            <div className="space-y-3">
              {postsPerCategory.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">
                      {cat.count}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(cat.count / maxCount) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
          )}
        </div>

        {/* Recent posts */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-foreground">أحدث المقالات</h2>
            <button
              onClick={() => onNavigate("posts")}
              className="text-xs text-accent hover:underline"
            >
              عرض الكل
            </button>
          </div>
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {post.author?.name || "بدون كاتب"} · {formatDate(post.createdAt)}
                    </div>
                  </div>
                  {post.category && (
                    <span
                      className="inline-block px-2 py-0.5 text-xs rounded-full text-white flex-shrink-0"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}
                  {!post.published && (
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground flex-shrink-0">
                      مسودة
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد مقالات</p>
          )}
        </div>
      </div>
    </div>
  );
}
