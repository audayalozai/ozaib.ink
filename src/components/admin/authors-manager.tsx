'use client'

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Author } from "@/lib/types";
import { ImageUploader } from "@/components/admin/image-uploader";

interface AuthorWithCount extends Author {
  _count?: { posts: number };
}

export function AuthorsManager() {
  const [authors, setAuthors] = useState<AuthorWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AuthorWithCount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAuthors = () => {
    setLoading(true);
    fetch("/api/admin/authors")
      .then((res) => res.json())
      .then((data) => setAuthors(data.authors || []))
      .catch(() => toast.error("فشل جلب الكُتّاب"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/authors/${editing.id}` : "/api/admin/authors";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(editing ? "تم تحديث الكاتب" : "تم إضافة الكاتب");
        setIsDialogOpen(false);
        fetchAuthors();
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
      const res = await fetch(`/api/admin/authors/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف الكاتب");
        setDeleteId(null);
        fetchAuthors();
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
            الكُتّاب
          </h1>
          <p className="text-sm text-muted-foreground">{authors.length} كاتب</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          كاتب جديد
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            لا يوجد كُتّاب بعد
          </div>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={author.avatar || undefined} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{author.name}</h3>
                  <p className="text-xs text-muted-foreground">{author.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditing(author);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteId(author.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {author.bio && (
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                  {author.bio}
                </p>
              )}
              <div className="text-xs text-muted-foreground">
                {author._count?.posts || 0} مقال
              </div>
            </div>
          ))
        )}
      </div>

      <AuthorEditor
        key={editing?.id || "new"}
        open={isDialogOpen}
        author={editing}
        saving={saving}
        onSave={handleSave}
        onClose={() => setIsDialogOpen(false)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الكاتب. مقالاته ستبقى لكن بدون كاتب.
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

interface AuthorEditorProps {
  open: boolean;
  author: AuthorWithCount | null;
  saving: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
}

function AuthorEditor({ open, author, saving, onSave, onClose }: AuthorEditorProps) {
  const initialFormData = author
    ? {
        name: author.name,
        bio: author.bio || "",
        avatar: author.avatar || "",
        role: author.role,
      }
    : {
        name: "",
        bio: "",
        avatar: "",
        role: "كاتب",
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
          <DialogTitle>{author ? "تعديل الكاتب" : "كاتب جديد"}</DialogTitle>
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
            <Label htmlFor="role">الدور</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>صورة الكاتب</Label>
            <ImageUploader
              value={formData.avatar}
              onChange={(url) => setFormData({ ...formData, avatar: url })}
              label="صورة الكاتب"
              aspect="avatar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">السيرة الذاتية</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
              {author ? "حفظ" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
