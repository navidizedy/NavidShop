"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getCategories(limit = 4) {
  const categories = await prisma.category.findMany({
    take: limit,
    orderBy: { id: "asc" },
  });

  return categories;
}
export const GetNavbarCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return categories.map((cat) => ({
      id: Number(cat.id),
      name: String(cat.name),
    }));
  },
  ["navbar-categories"],
  {
    tags: ["categories"],
    revalidate: 3600,
  },
);

export type CategoryItem = Awaited<ReturnType<typeof getCategories>>[number];
