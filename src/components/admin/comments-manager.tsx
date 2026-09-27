'use client'

import { useState, useCallback } from "react";
import {
  Check,
  X,
  Trash2,
  Loader2,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CommentWithPost {
  id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  post: {
    id: string;
    title: string;
    slug: string;
  };
}

interface CommentsManagerProps {
  onPostClick: (slug: string) => void;
}

export function CommentsManager({ onPostClick }: CommentsManagerProps) {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const fetchComments = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/comments")
      .then((res) => res.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => toast.error("فشل جلب التعليقات"))
      .finally(() => setLoading(false));
  }, []);

  // Initial fetch on mount
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchComments();
  }

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });

      if (res.ok) {
        toast.success(approved ? "تمت الموافقة على التعليق" : "تم رفض التعليق");
        fetchComments();
      } else {
        toast.error("فشل التحديث");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("تم حذف التعليق");
        fetchComments();
      } else {
        toast.error("فشل الحذف");
      }
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const filteredComments = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.approved).length;
  const approvedCount = comments.filter((c) => c.approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-1">
          التعليقات
        </h1>
        <p className="text-sm text-muted-foreground">
          {comments.length} تعليق · {pendingCount} بانتظار المراجعة · {approvedCount} موافق عليها
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {([
          { id: "pending", label: "بانتظار المراجعة", count: pendingCount },
          { id: "approved", label: "موافق عليها", count: approvedCount },
          { id: "all", label: "الكل", count: comments.length },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              filter === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className="mr-1.5 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Comments list */}
      {filteredComments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
          {filter === "pending"
            ? "لا توجد تعليقات بانتظار المراجعة"
            : filter === "approved"
            ? "لا توجد تعليقات موافق عليها"
            : "لا توجد تعليقات"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-card border rounded-xl p-5 ${
                comment.approved ? "border-border" : "border-amber-500/50 bg-amber-500/5"
              }`}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-bold text-foreground">{comment.name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {comment.email}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                    {comment.approved ? (
                      <Badge variant="default" className="bg-green-600 text-white text-xs">
                        موافق
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 text-xs">
                        بانتظار
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  <div className="text-xs text-muted-foreground mb-3">
                    على المقال:{" "}
                    <button
                      onClick={() => onPostClick(comment.post.slug)}
                      className="text-accent hover:underline inline-flex items-center gap-1"
                    >
                      {comment.post.title}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {!comment.approved && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(comment.id, true)}
                        className="gap-1.5 h-8"
                      >
                        <Check className="h-3.5 w-3.5" />
                        موافقة
                      </Button>
                    )}
                    {comment.approved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(comment.id, false)}
                        className="gap-1.5 h-8"
                      >
                        <X className="h-3.5 w-3.5" />
                        إلغاء الموافقة
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(comment.id)}
                      className="gap-1.5 h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
