'use client'

import { Clock, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryIcon } from "@/components/blog/category-icon";
import { Post, Author, Category } from "@/lib/types";

interface PostCardProps {
  post: Post & { author: Author | null; category: Category | null };
  onClick: (slug: string) => void;
  onAuthorClick?: (authorId: string) => void;
  variant?: "default" | "featured" | "compact";
}

export function PostCard({ post, onClick, onAuthorClick, variant = "default" }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  if (variant === "featured") {
    return (
      <button
        onClick={() => onClick(post.slug)}
        className="group block w-full text-right"
      >
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-center">
          {post.coverImage && (
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          <div>
            {post.category && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full text-white mb-4"
                style={{ backgroundColor: post.category.color }}
              >
                <CategoryIcon icon={post.category.icon} size={11} />
                {post.category.name}
              </span>
            )}
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:text-accent transition-colors text-foreground">
              {post.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {post.author && (
                  <>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={post.author.avatar || undefined} />
                      <AvatarFallback>
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAuthorClick?.(post.author!.id);
                        }}
                        className="text-sm font-bold text-foreground hover:text-accent transition-colors"
                      >
                        {post.author.name}
                      </button>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} دقائق
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => onClick(post.slug)}
        className="group flex gap-4 text-right w-full items-start"
      >
        {post.coverImage && (
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {post.category && (
            <span
              className="inline-block text-xs font-bold mb-1"
              style={{ color: post.category.color }}
            >
              {post.category.name}
            </span>
          )}
          <h3 className="font-bold text-sm leading-tight group-hover:text-accent transition-colors text-foreground line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(post.createdAt)} · {post.readTime} دقائق
          </p>
        </div>
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={() => onClick(post.slug)}
      className="group flex flex-col text-right h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300"
    >
      {post.coverImage && (
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        {post.category && (
          <span
            className="inline-block text-xs font-bold mb-3 self-start"
            style={{ color: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
        <h3 className="font-serif text-lg md:text-xl font-bold leading-snug mb-3 group-hover:text-accent transition-colors text-foreground line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            {post.author && (
              <>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={post.author.avatar || undefined} />
                  <AvatarFallback className="text-xs">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAuthorClick?.(post.author!.id);
                  }}
                  className="text-xs font-semibold text-foreground hover:text-accent transition-colors"
                >
                  {post.author.name}
                </button>
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime} د
          </span>
        </div>
      </div>
    </button>
  );
}
