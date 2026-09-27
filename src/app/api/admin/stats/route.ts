import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const [
      totalPosts,
      publishedPosts,
      featuredPosts,
      totalCategories,
      totalAuthors,
      totalSubscribers,
      pendingComments,
      recentPosts,
    ] = await Promise.all([
      db.post.count(),
      db.post.count({ where: { published: true } }),
      db.post.count({ where: { featured: true } }),
      db.category.count(),
      db.author.count(),
      db.subscriber.count(),
      db.comment.count({ where: { approved: false } }),
      db.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true, author: true },
      }),
    ]);

    // Posts per category
    const postsPerCategory = await db.category.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts: totalPosts - publishedPosts,
        featuredPosts,
        totalCategories,
        totalAuthors,
        totalSubscribers,
        pendingComments,
      },
      postsPerCategory: postsPerCategory.map((c) => ({
        name: c.name,
        color: c.color,
        count: c._count.posts,
      })),
      recentPosts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "فشل جلب الإحصائيات" }, { status: 500 });
  }
}
