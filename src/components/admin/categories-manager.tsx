'use client'

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Category } from "@/lib/types";
import { IconPicker } from "@/components/admin/icon-picker";
import { CategoryIcon } from "@/components/blog/category-icon";

interface CategoryWithCount extends Category {
  _count?: { posts: number };
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryWithCount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => toast.error("فشل جلب التصنيفات"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(editing ? "تم تحديث التصنيف" : "تم إنشاء التصنيف");
        setIsDialogOpen(false);
        fetchCategories();
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
      const res = await fetch(`/api/admin/categories/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("تم حذف التصنيف");
        setDeleteId(null);
        fetchCategories();
      } else {
        toast.error("فشل الحذف");
      }
    } catch {
      toast.error("حدث خطأ");
    }
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
            التصنيفات
          </h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} تصنيف
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          تصنيف جديد
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <FolderTree className="h-12 w-12 mx-auto mb-3 opacity-30" />
            لا توجد تصنيفات بعد
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon icon={cat.icon} size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditing(cat);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {cat.description || "لا يوجد وصف"}
              </p>
              <div className="text-xs text-muted-foreground">
                {cat._count?.posts || 0} مقال
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryEditor
        key={editing?.id || "new"}
        open={isDialogOpen}
        category={editing}
        saving={saving}
        onSave={handleSave}
        onClose={() => setIsDialogOpen(false)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف التصنيف. المقالات المرتبطة به ستبقى لكن بدون تصنيف.
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

interface CategoryEditorProps {
  open: boolean;
  category: CategoryWithCount | null;
  saving: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
}

function CategoryEditor({ open, category, saving, onSave, onClose }: CategoryEditorProps) {
  const initialFormData = category
    ? {
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        color: category.color,
        icon: category.icon || "",
      }
    : {
        name: "",
        slug: "",
        description: "",
        color: "#0f766e",
        icon: "",
      };

  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{category ? "تعديل التصنيف" : "تصنيف جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">الرابط *</Label>
            <Input
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              dir="ltr"
              className="text-left"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">اللون</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                dir="ltr"
                className="text-left"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">الأيقونة</Label>
            <IconPicker
              value={formData.icon}
              onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
            />
            <p className="text-xs text-muted-foreground">
              ستظهر هذه الأيقونة بجانب اسم التصنيف في كل مكان
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
              {category ? "حفظ" : "إنشاء"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
