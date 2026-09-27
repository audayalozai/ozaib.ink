import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// GET all posts (admin view - includes unpublished)
export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "فشل جلب المقالات" }, { status: 500 });
  }
}

// CREATE new post
export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      readTime,
      featured,
      published,
      tags,
      categoryId,
      authorId,
    } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { error: "الحقول الأساسية مطلوبة (العنوان، الرابط، المقتطف، المحتوى)" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "الرابط مستخدم بالفعل، اختر رابطاً آخر" },
        { status: 400 }
      );
    }

    const post = await db.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        readTime: readTime || 5,
        featured: featured || false,
        published: published !== undefined ? published : true,
        tags: tags || "",
        categoryId: categoryId || null,
        authorId: authorId || null,
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "فشل إنشاء المقال" }, { status: 500 });
  }
}
