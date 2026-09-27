import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const authors = await db.author.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { posts: true } },
      },
    });

    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json({ error: "فشل جلب الكُتّاب" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, avatar, role } = body;

    if (!name) {
      return NextResponse.json(
        { error: "اسم الكاتب مطلوب" },
        { status: 400 }
      );
    }

    const author = await db.author.create({
      data: {
        name,
        bio: bio || null,
        avatar: avatar || null,
        role: role || "كاتب",
      },
    });

    return NextResponse.json({ author }, { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json({ error: "فشل إنشاء الكاتب" }, { status: 500 });
  }
}
