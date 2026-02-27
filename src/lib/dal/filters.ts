import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },
  ["categories-cache"],
  { tags: ["categories"] },
);

export const getCachedColors = unstable_cache(
  async () => {
    return await prisma.color.findMany({
      orderBy: { name: "asc" },
    });
  },
  ["colors-cache"],
  { tags: ["colors"] },
);

export const getCachedSizes = unstable_cache(
  async () => {
    return await prisma.size.findMany({
      orderBy: { id: "asc" },
    });
  },
  ["sizes-cache"],
  { tags: ["sizes"] },
);
