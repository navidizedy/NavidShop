import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";

const BUCKET = "product-images";
const UPLOAD_FOLDER = "products";

async function uploadToSupabase(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
  const filePath = `${UPLOAD_FOLDER}/${fileName}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: file.type });
  if (error) throw new Error("Supabase upload failed");
  return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
}

const calculateProductMeta = (p: any) => {
  const variants = p.variants || [];
  const totalStock = variants.reduce(
    (acc: number, v: any) => acc + (v.count || 0),
    0,
  );
  const prices = variants.map((v: any) => Number(v.price ?? 0));

  const sorted = [...variants].sort((a, b) => {
    const aInStock = (a.count || 0) > 0;
    const bInStock = (b.count || 0) > 0;
    if (aInStock !== bInStock) return aInStock ? -1 : 1;
    return (a.price || 0) - (b.price || 0);
  });

  const bestVariant = sorted[0];

  return {
    lowest: prices.length ? Math.min(...prices) : 0,
    highest: prices.length ? Math.max(...prices) : 0,
    isOutOfStock: totalStock <= 0,
    displayVariant: {
      price: bestVariant?.price ?? 0,
      oldPrice: bestVariant?.oldPrice ?? null,
      discount: bestVariant?.discount ?? null,
    },
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categories = searchParams.getAll("categories");
    const colors = searchParams.getAll("colors");
    const sizes = searchParams.getAll("sizes");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.max(Number(searchParams.get("limit") || 12), 1);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (categories.length)
      where.categories = { some: { category: { name: { in: categories } } } };
    if (colors.length || sizes.length) {
      where.variants = {
        some: {
          ...(colors.length && { color: { name: { in: colors } } }),
          ...(sizes.length && { size: { name: { in: sizes } } }),
        },
      };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
          categories: { include: { category: true } },
          variants: { include: { color: true, size: true } },
        },
      }),
    ]);

    const enriched = products.map((p) => ({
      ...p,
      _meta: calculateProductMeta(p),
    }));

    if (sort === "lowest-price")
      enriched.sort((a, b) => a._meta.lowest - b._meta.lowest);
    if (sort === "highest-price")
      enriched.sort((a, b) => b._meta.highest - a._meta.highest);

    return NextResponse.json({
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const details = formData.get("details") as string | null;
    const categories = JSON.parse(
      (formData.get("categories") as string) || "[]",
    );
    const variants = JSON.parse((formData.get("variants") as string) || "[]");
    const imageFiles = formData.getAll("images") as File[];

    const imageUrls = await Promise.all(
      imageFiles.filter((f) => f.size > 0).map((f) => uploadToSupabase(f)),
    );

    const product = await prisma.product.create({
      data: {
        name,
        description,
        details,
        images: { create: imageUrls.map((url) => ({ url })) },
        categories: {
          create: categories.map((name: string) => ({
            category: {
              connectOrCreate: { where: { name }, create: { name } },
            },
          })),
        },
        variants: {
          create: variants.map((v: any) => ({
            count: v.count ?? 0,
            price: v.price ?? 0,
            oldPrice: v.oldPrice ?? null,
            discount: v.discount ?? null,
            size: v.size
              ? {
                  connectOrCreate: {
                    where: { name: v.size },
                    create: { name: v.size },
                  },
                }
              : undefined,
            color: v.color
              ? {
                  connectOrCreate: {
                    where: { name: v.color },
                    create: { name: v.color },
                  },
                }
              : undefined,
          })),
        },
      },
      include: {
        images: true,
        variants: { include: { color: true, size: true } },
        categories: { include: { category: true } },
      },
    });

    revalidateTag("products");
    revalidateTag("search");
    revalidateTag("on-sale-products");
    return NextResponse.json({
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}
