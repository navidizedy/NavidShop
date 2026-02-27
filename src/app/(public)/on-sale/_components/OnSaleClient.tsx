"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import Pagination from "@/components/Pagination";
import { OnSaleProduct } from "@/app/actions/getOnSaleProducts";

interface OnSaleClientProps {
  saleProducts: OnSaleProduct[];
  error: string | null;
  currentPage: number;
  totalPages: number;
}

export default function OnSaleClient({
  saleProducts,
  error,
  currentPage,
  totalPages,
}: OnSaleClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const noProducts = !error && saleProducts.length === 0;

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`/on-sale?page=${page}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <>
      <BreadCrumbGlobal />

      <div className="bg-white text-gray-800 min-h-screen">
        <section className="px-6 md:px-16 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            🔥 ON SALE NOW
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Don't miss out! We've gathered the best deals on your favorite items
            in one place.
          </p>
        </section>

        <section className="px-6 md:px-16 pb-20">
          {error ? (
            <div className="flex flex-col items-center justify-center py-24 bg-red-50 rounded-3xl border-2 border-dashed border-red-100 text-center px-4">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">{error}</h2>
            </div>
          ) : noProducts ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-2xl">
                🏷️
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Sale Items Right Now
              </h2>
              <Link
                href="/shop"
                className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {isPending
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-3 animate-pulse"
                      >
                        <div className="aspect-[4/5] w-full bg-gray-200 rounded-2xl" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      </div>
                    ))
                  : saleProducts.map((product) => {
                      const v = product.discountedVariant;
                      if (!v || !product.images?.[0]?.url) return null;

                      return (
                        <Card
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={v.price ?? 0}
                          oldPrice={v.oldPrice ?? null}
                          discount={v.discount ?? null}
                          image={product.images[0].url}
                          href={`/shop/${product.id}`}
                          isOutOfStock={product.isOutOfStock}
                        />
                      );
                    })}
              </div>

              {totalPages > 1 && (
                <div className="mt-16 border-t border-gray-100 pt-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    variant="light"
                  />
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
