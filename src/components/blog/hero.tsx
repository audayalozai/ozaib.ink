'use client'

import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  onAboutClick: () => void;
}

export function Hero({ onExplore, onAboutClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="arabic-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0 L60 30 L30 60 L0 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arabic-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            مدونة عربية مستقلة منذ ٢٠٢٤
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
            حين يلتقي
            <span className="block mt-2">
              <span className="text-accent">الفكر</span> بالـ
              <span className="text-accent">كلمة</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            مساحة عربية للكتابة والتأمل في الفلسفة والأدب والتقنية. مقالات أسبوعية
            تعيد الاعتبار للعمق في عصر السرعة.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onExplore}
              className="group inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
            >
              استكشف المقالات
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onAboutClick}
              className="inline-flex items-center gap-2 bg-transparent text-foreground border border-border hover:border-accent hover:text-accent px-8 py-4 rounded-full font-bold transition-all"
            >
              <BookOpen className="h-4 w-4" />
              عن المدونة
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-accent">
                ٨+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                مقالات منشورة
              </div>
            </div>
            <div className="text-center border-x border-border">
              <div className="font-serif text-3xl md:text-4xl font-bold text-accent">
                ٤
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                كتاب ومفكرون
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-accent">
                ٥
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                تصنيفات رئيسية
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
