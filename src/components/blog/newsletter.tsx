'use client'

import { useState } from "react";
import { Mail, Feather, Github, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewsletterProps {
  onSubscribe: (email: string) => Promise<{ success: boolean; message: string }>;
}

export function Newsletter({ onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = await onSubscribe(email);
      if (result.success) {
        toast.success(result.message);
        setEmail("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl p-8 md:p-12 border border-border">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-accent/10 mb-6">
          <Mail className="h-7 w-7 text-accent" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
          انضم إلى قائمة قرّاء ozaib.ink
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
          رسالة بريدية أسبوعية بأحدث المقالات والاقتراحات القرائية المختارة بعناية.
          لا رسائل مزعجة، لا إعلانات. فقط كلمة طيبة تصل إلى بريدك كل أسبوع.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-12 text-base"
          />
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="h-12 px-6"
          >
            {loading ? (
              "جاري الاشتراك..."
            ) : (
              <>
                اشترك الآن
                <Send className="h-4 w-4 mr-2" />
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
}
