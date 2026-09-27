'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Share2, Bookmark, Twitter, Linkedin, Facebook } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Post, Author, Category } from "@/lib/types";
import { Comments } from "@/components/blog/comments/comments";
import { ReadingControls } from "@/components/blog/reading-controls";
import { CategoryIcon } from "@/components/blog/category-icon";

interface PostViewProps {
  post: Post & { author: Author | null; category: Category | null };
  related: (Post & { author: Author | null; category: Category | null })[];
  onBack: () => void;
  onPostClick: (slug: string) => void;
  onAuthorClick?: (authorId: string) => void;
}

export function PostView({ post, related, onBack, onPostClick, onAuthorClick }: PostViewProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <article className="min-h-screen bg-background">
      {/* Reading progress bar */}
      <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-muted">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back button */}
      <div className="container mx-auto max-w-3xl px-4 pt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للمدونة
        </Button>
      </div>

      {/* Header */}
      <header className="container mx-auto max-w-3xl px-4 mb-12">
        {/* Category badge */}
        {post.category && (
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full text-white"
              style={{ backgroundColor: post.category.color }}
            >
              <CategoryIcon icon={post.category.icon} size={12} />
              {post.category.name}
            </span>
          </div>
        )}

        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          {post.excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-y border-border">
          <div className="flex items-center gap-3">
            {post.author && (
              <>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar || undefined} />
                  <AvatarFallback>
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <button
                    type="button"
                    onClick={() => onAuthorClick?.(post.author!.id)}
                    className="font-bold text-foreground hover:text-accent transition-colors"
                  >
                    {post.author.name}
                  </button>
                  <div className="text-sm text-muted-foreground">
                    {post.author.role}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} دقائق قراءة
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.split(",").map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                #{tag.trim()}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <div className="container mx-auto max-w-4xl px-4 mb-12">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto max-w-3xl px-4 pb-16">
        <div className="prose-article article-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Share & actions */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">
                شارك المقال:
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={handleShare}
                className="h-9 w-9 rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setBookmarked(!bookmarked)}
                className={`h-9 w-9 rounded-full ${bookmarked ? "bg-accent text-accent-foreground" : ""}`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Author bio */}
        {post.author && (
          <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.author.avatar || undefined} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-1">
                  {post.author.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {post.author.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">
              مقالات ذات صلة
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onPostClick(r.slug)}
                  className="text-right group"
                >
                  {r.coverImage && (
                    <div className="aspect-[4/3] overflow-hidden rounded-xl mb-3">
                      <img
                        src={r.coverImage}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {r.category && (
                    <span
                      className="inline-block text-xs font-bold mb-2"
                      style={{ color: r.category.color }}
                    >
                      {r.category.name}
                    </span>
                  )}
                  <h3 className="font-bold text-base leading-tight group-hover:text-accent transition-colors text-foreground">
                    {r.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <Comments postId={post.id} />
      </div>

      {/* Reading controls */}
      <ReadingControls />
    </article>
  );
}
