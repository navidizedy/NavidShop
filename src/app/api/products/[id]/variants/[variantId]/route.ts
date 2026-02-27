import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> },
) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    const body = await req.json();

    const { count, price, oldPrice, discount, color, size } = body;

    if (!color || !size) {
      return NextResponse.json(
        { message: "Color and Size names are required." },
        { status: 400 },
      );
    }

    let colorRecord = await prisma.color.findUnique({ where: { name: color } });
    if (!colorRecord) {
      colorRecord = await prisma.color.create({ data: { name: color } });
    }

    let sizeRecord = await prisma.size.findUnique({ where: { name: size } });
    if (!sizeRecord) {
      sizeRecord = await prisma.size.create({ data: { name: size } });
    }

    const updatedVariant = await prisma.productVariant.upsert({
      where: {
        productId_colorId_sizeId: {
          productId: productId,
          colorId: colorRecord.id,
          sizeId: sizeRecord.id,
        },
      },
      update: {
        count: Number(count),
        price: Number(price),
        oldPrice:
          oldPrice === "" || oldPrice === null ? null : Number(oldPrice),
        discount:
          discount === "" || discount === null ? null : Number(discount),
        updatedAt: new Date(),
      },
      create: {
        productId: productId,
        colorId: colorRecord.id,
        sizeId: sizeRecord.id,
        count: Number(count),
        price: Number(price),
        oldPrice:
          oldPrice === "" || oldPrice === null ? null : Number(oldPrice),
        discount:
          discount === "" || discount === null ? null : Number(discount),
      },
      include: { color: true, size: true },
    });

    ["products", "search", "on-sale-products", `product-${productId}`].forEach(
      (tag) => revalidateTag(tag),
    );

    return NextResponse.json({ data: updatedVariant });
  } catch (error: any) {
    console.error("UPSERT_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> },
) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    const variantId = parseInt(resolvedParams.variantId);

    if (isNaN(productId) || isNaN(variantId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return NextResponse.json(
        { message: "Variant not found" },
        { status: 404 },
      );
    }

    if (variant.productId !== productId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }

    const deletedVariant = await prisma.productVariant.delete({
      where: { id: variantId },
      include: { color: true, size: true },
    });

    ["products", "search", "on-sale-products", `product-${productId}`].forEach(
      (tag) => revalidateTag(tag),
    );

    return NextResponse.json({
      message: "Variant deleted successfully",
      data: deletedVariant,
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    return NextResponse.json(
      { message: "Failed to delete variant" },
      { status: 500 },
    );
  }
}
