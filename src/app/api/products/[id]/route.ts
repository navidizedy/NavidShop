import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

const BUCKET = "product-images";
const UPLOAD_FOLDER = "products";

async function uploadToSupabase(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
  const filePath = `${UPLOAD_FOLDER}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);
  return urlData.publicUrl;
}

function urlToObjectPath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const productId = Number(rawId);
    if (isNaN(productId))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const details = (formData.get("details") as string) || "";
    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]",
    );
    const existingImages = JSON.parse(
      (formData.get("existingImages") as string) || "[]",
    );
    const newImages = formData.getAll("newImages") as File[];

    const newImagesUrls = await Promise.all(
      newImages
        .filter((file) => file && file.size > 0)
        .map((file) => uploadToSupabase(file)),
    );

    const allImages = [...existingImages, ...newImagesUrls];

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const currentImages = await tx.productImage.findMany({
        where: { productId },
      });
      const removedImages = currentImages
        .map((img) => img.url)
        .filter((url) => !existingImages.includes(url));

      if (removedImages.length) {
        const pathsToDelete = removedImages
          .map(urlToObjectPath)
          .filter(Boolean) as string[];
        if (pathsToDelete.length)
          await supabase.storage.from(BUCKET).remove(pathsToDelete);
      }

      await tx.productImage.deleteMany({ where: { productId } });
      await tx.productCategory.deleteMany({ where: { productId } });

      return tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          details,
          updatedAt: new Date(),
          images: { create: allImages.map((url) => ({ url })) },
          categories: {
            create: categories.map((catName: string) => ({
              category: {
                connectOrCreate: {
                  where: { name: catName },
                  create: { name: catName },
                },
              },
            })),
          },
        },
        include: {
          images: true,
          variants: { include: { color: true, size: true } },
          categories: { include: { category: true } },
        },
      });
    });

    ["products", "search", "on-sale-products", `product-${productId}`].forEach(
      (tag) => revalidateTag(tag),
    );

    return NextResponse.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: error.message || "Failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, variants: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const variantIds = product.variants.map((v) => v.id);

    if (variantIds.length) {
      await prisma.cartItem.deleteMany({
        where: { variantId: { in: variantIds } },
      });
    }

    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    if (product.images.length) {
      const pathsToDelete = product.images
        .map((img) => urlToObjectPath(img.url))
        .filter(Boolean) as string[];

      if (pathsToDelete.length) {
        await supabase.storage.from(BUCKET).remove(pathsToDelete);
      }

      await prisma.productImage.deleteMany({ where: { productId } });
    }

    await prisma.productCategory.deleteMany({ where: { productId } });

    const deleted = await prisma.product.delete({ where: { id: productId } });
    revalidateTag("products");
    revalidateTag("search");
    revalidateTag("on-sale-products");
    revalidateTag(`product-${productId}`);
    return NextResponse.json({
      message: "Product deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete product" },
      { status: 500 },
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        variants: { include: { color: true, size: true } },
        categories: { include: { category: true } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Success", data: product });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
      { status: 500 },
    );
  }
}
