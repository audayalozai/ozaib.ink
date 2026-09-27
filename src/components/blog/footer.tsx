'use client'

import { Feather, Twitter, Github, Mail, Heart } from "lucide-react";
import { Category } from "@/lib/types";

interface FooterProps {
  categories: Category[];
  onHomeClick: () => void;
  onCategoryClick: (categoryId: string) => void;
  onAboutClick: () => void;
}

export function Footer({
  categories,
  onHomeClick,
  onCategoryClick,
  onAboutClick,
}: FooterProps) {
  return (
    <footer className="mt-auto bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <button onClick={onHomeClick} className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-foreground text-background">
                <Feather className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">
                ozaib<span className="text-accent">.ink</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-4">
              مدونة عربية مستقلة، تكتب في الفكر والأدب والتقنية. نؤمن أن الكلمة الطيبة
              شجرة طيبة، وأن العمق لا يزال ممكناً في عصر السرعة.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-background border border-border hover:border-accent hover:text-accent transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-background border border-border hover:border-accent hover:text-accent transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-background border border-border hover:border-accent hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">التصنيفات</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onCategoryClick(cat.id)}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-foreground">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onHomeClick}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={onAboutClick}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  عن المدونة
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  شروط الاستخدام
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ozaib.ink — جميع الحقوق محفوظة
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            صُنع بـ <Heart className="h-3 w-3 fill-accent text-accent" /> للقارئ العربي
          </p>
        </div>
      </div>
    </footer>
  );
}
