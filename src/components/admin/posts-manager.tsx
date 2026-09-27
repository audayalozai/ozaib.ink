'use client'

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Star,
  Loader2,
  Save,
  X,
  FileText,
  PenLine,
  Columns2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { MarkdownPreview } from "@/components/blog/markdown-preview";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Post, Author, Category } from "@/lib/types";

type PostWithRelations = Post & { author: Author | null; category: Category | null };

interface PostsManagerProps {
  categories: Category[];
  authors: Author[];
}

export function PostsManager({ categories, authors }: PostsManagerProps) {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState<PostWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/admin/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => toast.error("فشل جلب المقالات"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleNew = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (post: PostWithRelations) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const url = editingPost
        ? `/api/admin/posts/${editingPost.id}`
        : "/api/admin/posts";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(editingPost ? "تم تحديث المقال" : "تم إنشاء المقال");
        setIsDialogOpen(false);
        fetchPosts();
      } else {
        toast.error(result.error || "فشل الحفظ");
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/posts/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم حذف المقال");
        setDeleteId(null);
        fetchPosts();
      } else {
        toast.error("فشل الحذف");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const formatDate = (date: Date) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-1">
            المقالات
          </h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} مقال · {posts.filter(p => p.published).length} منشور · {posts.filter(p => !p.published).length} مسودة
          </p>
        </div>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" />
          مقال جديد
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث عن مقال..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Posts table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-right p-4 font-semibold text-foreground">العنوان</th>
                <th className="text-right p-4 font-semibold text-foreground hidden md:table-cell">التصنيف</th>
                <th className="text-right p-4 font-semibold text-foreground hidden lg:table-cell">الكاتب</th>
                <th className="text-right p-4 font-semibold text-foreground hidden md:table-cell">التاريخ</th>
                <th className="text-right p-4 font-semibold text-foreground">الحالة</th>
                <th className="text-right p-4 font-semibold text-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    {search ? "لا توجد نتائج مطابقة" : "لا توجد مقالات بعد"}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Star className="h-4 w-4 text-amber-500 fill-current flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium text-foreground line-clamp-1">{post.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {post.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {post.category && (
                        <Badge
                          variant="outline"
                          style={{ color: post.category.color, borderColor: post.category.color }}
                        >
                          {post.category.name}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">
                      {post.author?.name || "—"}
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground text-xs">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <Badge variant="default" className="bg-green-600 text-white">
                          <Eye className="h-3 w-3 ml-1" />
                          منشور
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 ml-1" />
                          مسودة
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(post)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(post.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor dialog - key forces re-mount when post changes */}
      <PostEditor
        key={editingPost?.id || "new"}
        open={isDialogOpen}
        post={editingPost}
        categories={categories}
        authors={authors}
        saving={saving}
        onSave={handleSave}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface PostEditorProps {
  open: boolean;
  post: PostWithRelations | null;
  categories: Category[];
  authors: Author[];
  saving: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
}

function PostEditor({
  open,
  post,
  categories,
  authors,
  saving,
  onSave,
  onClose,
}: PostEditorProps) {
  // Initialize state from post, use key prop pattern via useState initializer
  const initialFormData = post
    ? {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || "",
        readTime: post.readTime,
        featured: post.featured,
        published: post.published,
        tags: post.tags,
        categoryId: post.categoryId || "",
        authorId: post.authorId || "",
      }
    : {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        readTime: 5,
        featured: false,
        published: true,
        tags: "",
        categoryId: "",
        authorId: "",
      };

  const [formData, setFormData] = useState(initialFormData);

  const generateSlug = (title: string) => {
    // Simple slug generation - you could improve this
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FF\w-]/g, "")
      .slice(0, 60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{post ? "تعديل المقال" : "مقال جديد"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">العنوان *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({
                  ...formData,
                  title,
                  slug: post ? formData.slug : generateSlug(title),
                });
              }}
              placeholder="عنوان المقال"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">الرابط (slug) *</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-url-slug"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">المقتطف *</Label>
            <Textarea
              id="excerpt"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="ملخص قصير يظهر في بطاقة المقال"
              rows={2}
            />
          </div>

          {/* Content with Markdown Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">المحتوى (Markdown) *</Label>
              <span className="text-xs text-muted-foreground">
                {formData.content.length} حرف
              </span>
            </div>

            <Tabs defaultValue="split" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="write" className="gap-1.5">
                  <PenLine className="h-3.5 w-3.5" />
                  تحرير
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  معاينة
                </TabsTrigger>
                <TabsTrigger value="split" className="gap-1.5">
                  <Columns2 className="h-3.5 w-3.5" />
                  مقسّم
                </TabsTrigger>
              </TabsList>

              {/* Write only */}
              <TabsContent value="write" className="mt-2">
                <Textarea
                  id="content"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="## عنوان فرع&#10;&#10;اكتب المحتوى هنا... دعم Markdown"
                  rows={16}
                  className="font-mono text-sm"
                  dir="rtl"
                />
              </TabsContent>

              {/* Preview only */}
              <TabsContent value="preview" className="mt-2">
                <div className="min-h-[400px] max-h-[60vh] overflow-y-auto bg-background border border-border rounded-md p-6">
                  <MarkdownPreview content={formData.content} />
                </div>
              </TabsContent>

              {/* Split view */}
              <TabsContent value="split" className="mt-2">
                <div className="grid md:grid-cols-2 gap-3 h-[450px]">
                  <div className="flex flex-col h-full">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                      ✍️ تحرير
                    </div>
                    <Textarea
                      id="content"
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="## عنوان فرع&#10;&#10;اكتب المحتوى هنا..."
                      className="font-mono text-sm flex-1 resize-none"
                      dir="rtl"
                    />
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                      👁️ معاينة مباشرة
                    </div>
                    <div className="flex-1 overflow-y-auto bg-background border border-border rounded-md p-4">
                      <MarkdownPreview content={formData.content} />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground">
              يدعم Markdown: ## عنوان، **عريض**، *مائل*، &gt; اقتباس، - قائمة، `كود`، [رابط](url)
            </p>
          </div>

          {/* Cover image with uploader */}
          <div className="space-y-2">
            <Label>صورة الغلاف</Label>
            <ImageUploader
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              label="صورة الغلاف"
              aspect="cover"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">الوسوم (مفصولة بفواصل)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="أدب، شعر، تراث"
            />
          </div>

          {/* Selects */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر تصنيفاً" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الكاتب</Label>
              <Select
                value={formData.authorId}
                onValueChange={(value) => setFormData({ ...formData, authorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر كاتباً" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="readTime">وقت القراءة (دقائق)</Label>
              <Input
                id="readTime"
                type="number"
                min={1}
                max={60}
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <Label htmlFor="featured" className="cursor-pointer">مقال مميز</Label>
                <p className="text-xs text-muted-foreground mt-0.5">يظهر في الرئيسية</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <Label htmlFor="published" className="cursor-pointer">منشور</Label>
                <p className="text-xs text-muted-foreground mt-0.5">ظاهر للجمهور</p>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              {post ? "حفظ التغييرات" : "إنشاء المقال"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
