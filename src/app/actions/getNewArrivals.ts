"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getNewArrivals = async (limit = 4) => {
  return unstable_cache(
    async () => {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          variants: true,
          images: true,
        },
      });

      return products.map((product) => {
        const variants = product.variants || [];

        const totalStock = variants.reduce(
          (acc, variant) => acc + (variant.count || 0),
          0,
        );

        const sortedVariants = [...variants].sort((a, b) => {
          const aInStock = (a.count || 0) > 0;
          const bInStock = (b.count || 0) > 0;
          const aHasDiscount = (a.oldPrice ?? 0) > (a.price ?? 0);
          const bHasDiscount = (b.oldPrice ?? 0) > (b.price ?? 0);

          if (aInStock !== bInStock) return aInStock ? -1 : 1;
          if (aHasDiscount !== bHasDiscount) return aHasDiscount ? -1 : 1;
          return (a.price || 0) - (b.price || 0);
        });

        return {
          ...product,
          bestVariant: sortedVariants[0] || null,
          isOutOfStock: totalStock <= 0,
        };
      });
    },
    [`new-arrivals-limit-${limit}`],
    {
      tags: ["products"],
      revalidate: false,
    },
  )();
};

export type NewArrivalProduct = Awaited<
  ReturnType<typeof getNewArrivals>
>[number];
