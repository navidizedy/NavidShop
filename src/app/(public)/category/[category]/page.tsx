import { redirect } from "next/navigation";
import { getCachedCategoryProducts } from "@/lib/dal/categories";
import CategoryPageView from "../_components/categoryPageView";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page } = await searchParams;

  const slug = category.toLowerCase().replace(/-/g, " ");
  const currentPage = Number(page) || 1;

  const { products, totalCount } = await getCachedCategoryProducts(
    slug,
    currentPage,
  );

  if (
    !products ||
    (products.length === 0 && currentPage === 1 && totalCount > 0)
  ) {
    redirect("/shop");
  }

  const productsWithMeta = products.map((p) => {
    const variants = p.variants || [];
    const totalStock = variants.reduce((acc, v) => acc + (v.count || 0), 0);

    const sorted = [...variants].sort((a, b) => {
      const aInStock = (a.count || 0) > 0;
      const bInStock = (b.count || 0) > 0;
      const aHasDiscount = (a.oldPrice ?? 0) > a.price;
      const bHasDiscount = (b.oldPrice ?? 0) > b.price;

      if (aInStock !== bInStock) return aInStock ? -1 : 1;
      if (aHasDiscount !== bHasDiscount) return aHasDiscount ? -1 : 1;
      return (a.price || 0) - (b.price || 0);
    });

    return {
      ...p,
      isOutOfStock: totalStock <= 0,
      bestVariant: sorted[0] || null,
    };
  });

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <CategoryPageView
      category={slug}
      products={productsWithMeta}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
