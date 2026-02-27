import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function sanitizeFileName(filename: string) {
  const ext = filename.split(".").pop() || "png";
  const base = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "image"}.${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = form.get("name") as string;
    const file = form.get("image") as File | null;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 },
      );
    }

    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = sanitizeFileName(file.name);

      const filePath = `categories/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, buffer, { contentType: file.type });

      if (error) {
        console.error(error);
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 },
        );
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const category = await prisma.category.create({
      data: { name, imageUrl },
    });

    return NextResponse.json(
      { message: "Category added", data: category },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
