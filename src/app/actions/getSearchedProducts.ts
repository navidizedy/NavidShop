"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getProductsAction({
  query,
  page = 1,
  limit = 12,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;
  const cleanQuery = query?.trim() || "";

  const where: Prisma.ProductWhereInput = {};

  if (cleanQuery) {
    where.name = {
      contains: cleanQuery,
      mode: "insensitive",
    };
  }

  try {
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: { select: { url: true } },
          variants: {
            select: {
              price: true,
              oldPrice: true,
              discount: true,
              count: true,
            },
          },
        },
      }),
    ]);

    const enriched = products.map((p) => {
      const variants = p.variants || [];

      const totalStock = variants.reduce((acc, v) => acc + (v.count || 0), 0);

      const sorted = [...variants].sort((a, b) => {
        const aInStock = (a.count || 0) > 0;
        const bInStock = (b.count || 0) > 0;
        const aHasDiscount = (a.oldPrice ?? 0) > a.price;
        const bHasDiscount = (b.oldPrice ?? 0) > b.price;

        if (aInStock !== bInStock) return aInStock ? -1 : 1;
        if (aHasDiscount !== bHasDiscount) return aHasDiscount ? -1 : 1;
        return a.price - b.price;
      });

      const best = sorted[0];

      return {
        ...p,

        lowestPrice: best?.price ?? 0,
        oldPrice: best?.oldPrice ?? null,
        discount: best?.discount ?? null,
        isOutOfStock: totalStock <= 0,
      };
    });

    return {
      data: enriched,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + products.length < total,
    };
  } catch (error) {
    console.error("Search Action Error:", error);
    return { data: [], total: 0, totalPages: 0, hasMore: false };
  }
}
