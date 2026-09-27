'use client'

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Clock, Calendar, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/blog/post-card";
import { Author, Post, Category } from "@/lib/types";

type PostWithRelations = Post & { author: Author | null; category: Category | null };

interface AuthorPageProps {
  authorId: string;
  onBack: () => void;
  onPostClick: (slug: string) => void;
}

export function AuthorPage({ authorId, onBack, onPostClick }: AuthorPageProps) {
  const [author, setAuthor] = useState<(Author & { posts: PostWithRelations[]; _count: { posts: number } }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/authors?id=${authorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.author) setAuthor(data.author);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authorId]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">الكاتب غير موجود</p>
        <Button variant="outline" onClick={onBack}>العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-muted-foreground"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للمدونة
        </Button>

        {/* Author Header */}
        <header className="text-center mb-16">
          <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-background shadow-lg">
            <AvatarImage src={author.avatar || undefined} />
            <AvatarFallback className="text-4xl font-serif">
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            {author.name}
          </h1>

          <p className="text-lg text-accent font-semibold mb-6">
            {author.role}
          </p>

          {author.bio && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              {author.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 py-6 border-y border-border">
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-accent">
                {author._count.posts}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                مقال منشور
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-accent">
                {author.posts.reduce((sum, p) => sum + p.readTime, 0)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                دقيقة قراءة
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-accent">
                {author.posts.length > 0
                  ? formatDate(author.posts[author.posts.length - 1].createdAt).split(" ")[2]
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                آخر سنة نشر
              </div>
            </div>
          </div>
        </header>

        {/* Posts */}
        {author.posts.length > 0 ? (
          <section>
            <div className="mb-10">
              <div className="text-sm font-bold text-accent mb-2">
                كل المقالات
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                كتابات {author.name}
              </h2>
              <span className="section-divider block"></span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {author.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={onPostClick}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <Feather className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2 text-foreground">
              لا توجد مقالات بعد
            </h3>
            <p className="text-muted-foreground">
              لم ينشر {author.name} أي مقالات حتى الآن
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
