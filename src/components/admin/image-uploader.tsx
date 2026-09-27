'use client'

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: "cover" | "avatar";
}

export function ImageUploader({
  value,
  onChange,
  label = "صورة",
  aspect = "cover",
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء اختيار ملف صورة صالح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يتجاوز 5 ميجابايت");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onChange(data.url);
        toast.success("تم رفع الصورة بنجاح");
      } else {
        toast.error(data.error || "فشل رفع الصورة");
      }
    } catch {
      toast.error("حدث خطأ أثناء الرفع");
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      toast.success("تم إضافة رابط الصورة");
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            mode === "upload"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-3.5 w-3.5 inline ml-1" />
          رفع
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            mode === "url"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5 inline ml-1" />
          رابط
        </button>
      </div>

      {/* Preview if value exists */}
      {value && (
        <div className="relative group">
          <div
            className={`overflow-hidden rounded-lg border border-border bg-muted ${
              aspect === "cover" ? "aspect-video" : "aspect-square w-32"
            }`}
          >
            {/* Image preview (using img tag for dynamic external URLs) */}
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 left-2 bg-destructive text-white rounded-full p-1.5 hover:bg-destructive/90 shadow-md transition-colors"
            aria-label="إزالة الصورة"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            تم التحديد
          </div>
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">جاري الرفع...</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-3">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                اسحب صورة هنا أو اضغط للاختيار
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP, GIF · حتى 5 ميجابايت
              </p>
            </>
          )}
        </div>
      )}

      {/* URL mode */}
      {mode === "url" && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            dir="ltr"
            className="text-left"
          />
          <Button type="submit" variant="outline">
            <ImageIcon className="h-4 w-4 ml-1" />
            إضافة
          </Button>
        </form>
      )}

      {/* Current value (hidden display) */}
      {value && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="text-xs text-left text-muted-foreground"
          placeholder="مسار الصورة"
        />
      )}
    </div>
  );
}
