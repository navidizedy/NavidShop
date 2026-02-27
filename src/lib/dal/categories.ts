import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function fetchCategoryProducts(slug: string, page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const whereClause = {
    categories: {
      some: {
        category: {
          name: { equals: slug, mode: "insensitive" as const },
        },
      },
    },
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip: skip,
      take: pageSize,
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  return { products, totalCount };
}

export const getCachedCategoryProducts = (slug: string, page: number) => {
  return unstable_cache(
    async () => fetchCategoryProducts(slug, page),
    [`category-page-${slug}-${page}`],
    {
      revalidate: 3600,
      tags: ["products", `category-${slug}`],
    },
  )();
};
