'use client'

import { useEffect, useState } from "react";
import { Search, X, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCard } from "@/components/blog/post-card";
import { Post, Author, Category } from "@/lib/types";

type PostWithRelations = Post & { author: Author | null; category: Category | null };

interface AdvancedSearchProps {
  initialQuery?: string;
  categories: Category[];
  authors: Author[];
  onPostClick: (slug: string) => void;
  onAuthorClick: (authorId: string) => void;
  onBack: () => void;
}

export function AdvancedSearch({
  initialQuery = "",
  categories,
  authors,
  onPostClick,
  onAuthorClick,
  onBack,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [featured, setFeatured] = useState(false);
  const [sort, setSort] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState<PostWithRelations[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (categoryId) params.set("categoryId", categoryId);
    if (authorId) params.set("authorId", authorId);
    if (tag) params.set("tag", tag);
    if (featured) params.set("featured", "true");
    params.set("sort", sort);

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.posts || []);
      setTags(data.tags || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryId, authorId, tag, featured, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategoryId("");
    setAuthorId("");
    setTag("");
    setFeatured(false);
    setSort("newest");
  };

  const hasActiveFilters = query || categoryId || authorId || tag || featured;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            بحث متقدم
          </h1>
          <p className="text-muted-foreground">
            ابحث في المقالات بالكلمات المفتاحية، الوسوم، التصنيفات، أو الكاتب
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="ابحث في العناوين، المقتطفات، الوسوم..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-12 h-12 text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            فلاتر متقدمة
            {hasActiveFilters && (
              <Badge variant="default" className="mr-1">
                نشط
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-xs">
              <X className="h-3 w-3 ml-1" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-5 mb-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">التصنيف</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل التصنيفات</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">الكاتب</Label>
              <Select value={authorId} onValueChange={(v) => setAuthorId(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الكُتّاب</SelectItem>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">ترتيب حسب</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث أولاً</SelectItem>
                  <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                  <SelectItem value="title">حسب العنوان</SelectItem>
                  <SelectItem value="readTime">أقصر وقت قراءة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm font-medium">المقالات المميزة فقط</span>
              </label>
            </div>
          </div>
        )}

        {/* Tag cloud */}
        {tags.length > 0 && !tag && (
          <div className="mb-6">
            <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
              الوسوم الشائعة
            </Label>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 15).map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTag(t.name)}
                  className="px-3 py-1 text-xs bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
                >
                  #{t.name} <span className="opacity-60">({t.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active tag filter */}
        {tag && (
          <div className="mb-4">
            <Badge variant="default" className="gap-1">
              #{tag}
              <button onClick={() => setTag("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Results count */}
        {hasSearched && (
          <div className="mb-6 text-sm text-muted-foreground">
            {loading ? (
              "جاري البحث..."
            ) : (
              <>
                {results.length > 0
                  ? `عُثر على ${results.length} مقال`
                  : "لا توجد نتائج مطابقة"}
              </>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-5">
                  <div className="h-3 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-5 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              جرّب تعديل الفلاتر أو كلمات بحث مختلفة
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
