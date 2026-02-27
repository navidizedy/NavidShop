import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getCachedProductDetail } from "@/lib/dal/product-detail";
import ProductDetailView from "../_components/product-detail";

const calculateProductMeta = (product: any) => {
  const variants = product.variants || [];
  if (variants.length === 0) return { lowest: 0, lowestVariant: null };

  const sortedVariants = [...variants].sort((a, b) => {
    const aHasDiscount = (a.oldPrice ?? 0) > a.price;
    const bHasDiscount = (b.oldPrice ?? 0) > b.price;
    const aInStock = (a.count ?? 0) > 0;
    const bInStock = (b.count ?? 0) > 0;

    if (aInStock !== bInStock) return aInStock ? -1 : 1;
    if (aHasDiscount !== bHasDiscount) return aHasDiscount ? -1 : 1;
    return (a.price || 0) - (b.price || 0);
  });

  return {
    lowest: Math.min(...variants.map((v: any) => Number(v.price ?? 0))),
    lowestVariant: sortedVariants[0],
  };
};

const ProductDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) redirect("/shop");

  const [session, data] = await Promise.all([
    getSession(),
    getCachedProductDetail(productId),
  ]);

  if (!data || !data.product) redirect("/shop");

  const enrichedProduct = {
    ...data.product,
    _meta: calculateProductMeta(data.product),
  };

  return (
    <ProductDetailView
      session={session}
      initialProduct={enrichedProduct}
      initialRelatedProducts={data.relatedProducts}
    />
  );
};

export default ProductDetail;
