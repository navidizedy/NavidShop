import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function fetchFullProductDetail(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        select: { url: true },
        orderBy: { id: "asc" },
      },
      variants: {
        include: { color: true, size: true },
      },
      categories: {
        select: {
          categoryId: true,
          category: { select: { name: true } },
        },
      },
    },
  });

  if (!product) return null;

  const categoryIds = product.categories.map((c) => c.categoryId);

  const rawRelatedProducts = await prisma.product.findMany({
    where: {
      id: { not: productId },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    include: {
      images: {
        select: { url: true },
        take: 1,
      },
      variants: {
        select: {
          price: true,
          oldPrice: true,
          discount: true,
          count: true,
        },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const relatedProducts = rawRelatedProducts.map((p) => ({
    ...p,
    variants:
      p.variants.length > 0
        ? p.variants
        : [{ price: 0, oldPrice: null, discount: null, count: 0 }],
  }));

  return { product, relatedProducts };
}

export const getCachedProductDetail = (productId: number) => {
  return unstable_cache(
    async () => fetchFullProductDetail(productId),
    [`product-detail-v2-${productId}`],
    {
      revalidate: 3600,
      tags: ["products", `product-${productId}`],
    },
  )();
};
