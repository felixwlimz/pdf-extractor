import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle file uploads
  },
};

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const uploadsDir = path.join(process.cwd(), searchParams.get("uploadsDir") || "uploads");
  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || typeof file.name !== "string") {
    return NextResponse.json({ success: false, message: "Invalid file upload" }, { status: 400 });
  }

  const fileName = file.name;
  const filePath = path.join(uploadsDir, fileName);

  // Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ success: true, fileName, uploadsDir });
}