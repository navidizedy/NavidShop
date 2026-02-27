"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getOnSaleProducts = async (
  page: number = 1,
  limit: number = 10,
) => {
  return unstable_cache(
    async () => {
      const skip = (page - 1) * limit;

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where: {
            variants: {
              some: {
                discount: { gt: 0 },
                count: { gt: 0 },
              },
            },
          },
          include: {
            images: true,
            variants: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: skip,
          take: limit,
        }),
        prisma.product.count({
          where: {
            variants: {
              some: {
                discount: { gt: 0 },
                count: { gt: 0 },
              },
            },
          },
        }),
      ]);

      const formattedProducts = products.map((product) => {
        const discountedVariants = product.variants.filter(
          (v) => (v.discount ?? 0) > 0 && (v.count ?? 0) > 0,
        );

        const bestVariant = [...discountedVariants].sort((a, b) => {
          return (a.price ?? 0) - (b.price ?? 0);
        })[0];

        const totalStock = product.variants.reduce(
          (acc, v) => acc + (v.count || 0),
          0,
        );

        return {
          ...product,
          discountedVariant: bestVariant || null,
          isOutOfStock: totalStock <= 0,
        };
      });

      return {
        products: formattedProducts,
        totalPages: Math.ceil(totalCount / limit),
      };
    },
    [`on-sale-page-${page}-limit-${limit}`],
    {
      tags: ["on-sale-products"],
      revalidate: false,
    },
  )();
};

export type OnSaleProduct = Awaited<
  ReturnType<typeof getOnSaleProducts>
>["products"][number];
