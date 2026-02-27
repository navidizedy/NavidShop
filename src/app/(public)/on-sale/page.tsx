import { getOnSaleProducts } from "@/app/actions/getOnSaleProducts";
import OnSaleClient from "./_components/OnSaleClient";
import type { OnSaleProduct } from "@/app/actions/getOnSaleProducts";

export default async function OnSalePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  let saleProducts: OnSaleProduct[] = [];
  let totalPages = 1;
  let error: string | null = null;

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  try {
    const data = await getOnSaleProducts(currentPage, 10);
    saleProducts = data.products;
    totalPages = data.totalPages;
  } catch (err) {
    console.error("Error fetching on-sale products:", err);
    error = "Failed to load products. Please try again later.";
  }

  return (
    <OnSaleClient
      saleProducts={saleProducts}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
