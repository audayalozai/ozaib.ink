import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

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
    const { name, bio, avatar, role } = body;

    const existing = await db.author.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الكاتب غير موجود" }, { status: 404 });
    }

    const author = await db.author.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        ...(role !== undefined && { role }),
      },
    });

    return NextResponse.json({ author });
  } catch (error) {
    console.error("Error updating author:", error);
    return NextResponse.json({ error: "فشل تحديث الكاتب" }, { status: 500 });
  }
}

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

    const existing = await db.author.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الكاتب غير موجود" }, { status: 404 });
    }

    await db.post.updateMany({
      where: { authorId: id },
      data: { authorId: null },
    });

    await db.author.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting author:", error);
    return NextResponse.json({ error: "فشل حذف الكاتب" }, { status: 500 });
  }
}
