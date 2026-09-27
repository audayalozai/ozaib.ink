/* Update existing categories with appropriate icons */
import { db } from "../src/lib/db";

async function main() {
  console.log("🎨 تحديث أيقونات التصنيفات...");

  const updates = [
    { slug: "literature", icon: "BookOpen" },       // أدب ونقد - كتاب مفتوح
    { slug: "philosophy", icon: "Brain" },           // فكر وفلسفة - دماغ
    { slug: "technology", icon: "Cpu" },             // تقنية ومستقبل - معالج
    { slug: "self-development", icon: "Sparkles" },  // تنمية ذاتية - شرارة
    { slug: "marginalia", icon: "Feather" },         // هوامش - ريشة
  ];

  for (const { slug, icon } of updates) {
    const updated = await db.category.update({
      where: { slug },
      data: { icon },
    });
    console.log(`  ✅ ${updated.name}: ${icon}`);
  }

  // Add a new trial category: تاريخ وتراث
  const existing = await db.category.findUnique({ where: { slug: "history-heritage" } });
  if (existing) {
    console.log("ℹ️  تصنيف 'تاريخ وتراث' موجود بالفعل");
  } else {
    const newCat = await db.category.create({
      data: {
        name: "تاريخ وتراث",
        slug: "history-heritage",
        description: "مقالات في التاريخ الإسلامي والعربي، وقراءات في المخطوطات والتراث المعماري والفكري",
        color: "#7c2d12",
        icon: "Scroll",
      },
    });
    console.log(`  ✅ تصنيف جديد: ${newCat.name} (أيقونة: Scroll)`);
  }

  // Add another trial category: فنون وإبداع
  const existing2 = await db.category.findUnique({ where: { slug: "arts-creativity" } });
  if (existing2) {
    console.log("ℹ️  تصنيف 'فنون وإبداع' موجود بالفعل");
  } else {
    const newCat2 = await db.category.create({
      data: {
        name: "فنون وإبداع",
        slug: "arts-creativity",
        description: "مقالات في الفنون البصرية والموسيقى والسينما، وقراءات في الإبداع الإنساني",
        color: "#be185d",
        icon: "Palette",
      },
    });
    console.log(`  ✅ تصنيف جديد: ${newCat2.name} (أيقونة: Palette)`);
  }

  const count = await db.category.count();
  console.log(`\n✅ تم! إجمالي التصنيفات: ${count}`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ خطأ:", e);
    await db.$disconnect();
    process.exit(1);
  });
