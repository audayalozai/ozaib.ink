import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم رفع أي ملف" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. الأنواع المدعومة: JPG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "حجم الملف يتجاوز 5 ميجابايت" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const hash = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now();
    const filename = `${timestamp}-${hash}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image using sharp
    // - Resize if larger than 1600px wide (maintain aspect ratio)
    // - Convert to optimized format
    let processedBuffer: Buffer;
    if (file.type === "image/gif") {
      // Don't process GIFs (preserve animation)
      processedBuffer = buffer;
    } else {
      processedBuffer = await sharp(buffer)
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
      // Change filename extension to .jpg
      const jpgFilename = filename.replace(/\.(png|webp|jpg|jpeg)$/i, ".jpg");
      const jpgFilepath = path.join(UPLOAD_DIR, jpgFilename);
      await writeFile(jpgFilepath, processedBuffer);
      return NextResponse.json({
        url: `/uploads/${jpgFilename}`,
        filename: jpgFilename,
        originalName: file.name,
        size: processedBuffer.length,
      });
    }

    await writeFile(filepath, processedBuffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      originalName: file.name,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء رفع الملف" },
      { status: 500 }
    );
  }
}
