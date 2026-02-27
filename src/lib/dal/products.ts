import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function fetchFilteredProducts(params: any) {
  const limit = 12;
  const page = Math.max(Number(params.page || 1), 1);
  const skip = (page - 1) * limit;

  const categories = params.c?.split(",").filter(Boolean) || [];
  const colors = params.co?.split(",").filter(Boolean) || [];
  const sizes = params.s?.split(",").filter(Boolean) || [];
  const sort = params.sort || "All";

  const where: any = {};
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
      orderBy:
        sort === "All" || sort === "Most Popular"
          ? { createdAt: "desc" }
          : undefined,
      include: {
        images: true,
        variants: { include: { color: true, size: true } },
      },
    }),
  ]);

  return { products, total };
}

export const getCachedProducts = (params: any) => {
  const cacheKey = JSON.stringify(params);

  return unstable_cache(
    async () => fetchFilteredProducts(params),
    [`products-list-${cacheKey}`],
    {
      revalidate: 3600,
      tags: ["products"],
    },
  )();
};
