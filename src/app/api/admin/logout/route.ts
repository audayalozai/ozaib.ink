import { NextResponse } from "next/server";
import { getAdminToken, destroyAdminSession, getSessionCookieName } from "@/lib/auth";

export async function POST() {
  try {
    const token = await getAdminToken();
    if (token) {
      await destroyAdminSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete(getSessionCookieName());
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الخروج" },
      { status: 500 }
    );
  }
}
