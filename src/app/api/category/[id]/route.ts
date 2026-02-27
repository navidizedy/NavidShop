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

function extractStoragePath(publicUrl: string) {
  return publicUrl.split("/storage/v1/object/public/product-images/")[1];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    const form = await req.formData();
    const name = form.get("name") as string;
    const file = form.get("image") as File | null;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    let imageUrl = existing.imageUrl;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = sanitizeFileName(file.name);
      const filePath = `categories/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, buffer, {
          contentType: file.type,
        });

      if (error) {
        console.error(error);
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 },
        );
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;

      if (existing.imageUrl) {
        const oldPath = extractStoragePath(existing.imageUrl);
        if (oldPath) {
          await supabase.storage.from("product-images").remove([oldPath]);
        }
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, imageUrl },
    });

    return NextResponse.json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    const existing = await prisma.category.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    if (existing.imageUrl) {
      const oldPath = extractStoragePath(existing.imageUrl);
      if (oldPath) {
        await supabase.storage.from("product-images").remove([oldPath]);
      }
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
