import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// UPDATE post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    // Check if post exists
    const existing = await db.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    // Check slug uniqueness (if changed)
    if (slug && slug !== existing.slug) {
      const slugConflict = await db.post.findUnique({ where: { slug } });
      if (slugConflict) {
        return NextResponse.json(
          { error: "الرابط مستخدم بالفعل" },
          { status: 400 }
        );
      }
    }

    const post = await db.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage: coverImage || null }),
        ...(readTime !== undefined && { readTime }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(tags !== undefined && { tags }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(authorId !== undefined && { authorId: authorId || null }),
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "فشل تحديث المقال" }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await db.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    await db.post.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "فشل حذف المقال" }, { status: 500 });
  }
}
