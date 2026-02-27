import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function fetchSearchedProducts(
  query: string,
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;

  const whereClause = {
    name: {
      contains: query,
      mode: "insensitive" as const,
    },
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: { images: true, variants: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const formattedProducts = products.map((p) => {
    const variants = p.variants || [];

    const totalStock = variants.reduce((acc, v) => acc + (v.count || 0), 0);

    const discountedVariants = variants.filter(
      (v) => (v.discount ?? 0) > 0 && (v.count ?? 0) > 0,
    );

    const bestVariant =
      discountedVariants.length > 0
        ? [...discountedVariants].sort(
            (a, b) => (a.price ?? 0) - (b.price ?? 0),
          )[0]
        : [...variants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];

    return {
      ...p,

      price: bestVariant?.price ?? 0,
      oldPrice: bestVariant?.oldPrice ?? null,
      discount: bestVariant?.discount ?? null,
      isOutOfStock: totalStock <= 0,
    };
  });

  return {
    products: formattedProducts,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export const getCachedSearch = (query: string, page: number) => {
  return unstable_cache(
    async () => fetchSearchedProducts(query, page, 10),
    [`search-name-only-${query.toLowerCase()}-${page}`],
    { revalidate: 3600, tags: ["products", "search"] },
  )();
};
