import {
  getCachedCategories,
  getCachedColors,
  getCachedSizes,
} from "@/lib/dal/filters";
import { getCachedProducts } from "@/lib/dal/products";
import ShopView from "./_components/shopView";

const calculateProductMeta = (p: any) => {
  const variants = p.variants || [];
  const prices = variants.map((v: any) => Number(v.price ?? 0));
  const sortedVariants = [...variants].sort((a, b) => {
    const aInStock = (a.count || 0) > 0;
    const bInStock = (b.count || 0) > 0;
    if (aInStock !== bInStock) return aInStock ? -1 : 1;
    return (a.price || 0) - (b.price || 0);
  });
  const bestVariant = sortedVariants[0];

  return {
    lowest: prices.length ? Math.min(...prices) : 0,
    highest: prices.length ? Math.max(...prices) : 0,
    isOutOfStock:
      variants.reduce((acc: number, v: any) => acc + (v.count || 0), 0) <= 0,
    displayVariant: {
      price: bestVariant?.price ?? 0,
      oldPrice: bestVariant?.oldPrice ?? null,
      discount: bestVariant?.discount ?? null,
    },
  };
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  const sortLabel = params.sort || "All";

  const [categories, colors, sizes, productData] = await Promise.all([
    getCachedCategories(),
    getCachedColors(),
    getCachedSizes(),
    getCachedProducts(params),
  ]);

  let enriched = productData.products.map((p: any) => ({
    ...p,
    _meta: calculateProductMeta(p),
  }));

  if (sortLabel === "Lowest Price") {
    enriched.sort((a, b) => a._meta.lowest - b._meta.lowest);
  } else if (sortLabel === "Highest Price") {
    enriched.sort((a, b) => b._meta.highest - a._meta.highest);
  }

  return (
    <ShopView
      categories={categories}
      colors={colors}
      sizes={sizes}
      initialProducts={enriched}
      totalProducts={productData.total}
    />
  );
}
