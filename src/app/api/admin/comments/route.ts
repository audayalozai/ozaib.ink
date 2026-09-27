import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const comments = await db.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "فشل جلب التعليقات" }, { status: 500 });
  }
}
