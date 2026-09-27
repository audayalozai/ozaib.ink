import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      // Return all authors with post counts (public)
      const authors = await db.author.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              posts: {
                where: { published: true },
              },
            },
          },
        },
      });

      return NextResponse.json({ authors });
    }

    // Get specific author with their published posts
    const author = await db.author.findUnique({
      where: { id },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
            author: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    });

    if (!author) {
      return NextResponse.json({ error: "الكاتب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ author });
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json({ error: "فشل جلب الكاتب" }, { status: 500 });
  }
}
