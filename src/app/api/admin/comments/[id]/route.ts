import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(
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
    const { approved } = body;

    const existing = await db.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
    }

    const comment = await db.comment.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "فشل تحديث التعليق" }, { status: 500 });
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

    const existing = await db.comment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
    }

    await db.comment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "فشل حذف التعليق" }, { status: 500 });
  }
}
