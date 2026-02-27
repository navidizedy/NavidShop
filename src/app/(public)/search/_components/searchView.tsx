"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import Pagination from "@/components/Pagination";
import { ArrowRight, SearchX } from "lucide-react";

export default function SearchView({
  query,
  initialProducts,
  totalPages,
  currentPage,
}: {
  query: string;
  initialProducts: any[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <>
      <BreadCrumbGlobal />
      <section className="bg-white text-gray-800 min-h-screen">
        <div className="px-6 md:px-16 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
            {query ? `Results for "${query}"` : "Search Our Collection"}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            {initialProducts.length > 0
              ? `We found items matching your request.`
              : "Looking for something specific? Use the search bar above."}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
          {initialProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <SearchX className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Results Found
              </h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                We couldn't find anything for{" "}
                <span className="font-bold text-gray-800">"{query}"</span>.
              </p>
              <Link
                href="/shop"
                className="group flex items-center gap-2 bg-black text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-md"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                {isPending
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-3 animate-pulse"
                      >
                        <div className="aspect-[4/5] bg-gray-100 rounded-2xl" />
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                      </div>
                    ))
                  : initialProducts.map((product) => (
                      <Card
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        image={product.images?.[0]?.url || "/placeholder.jpg"}
                        discount={product.discount}
                        href={`/shop/${product.id}`}
                        isOutOfStock={product.isOutOfStock}
                      />
                    ))}
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
        </div>
      </section>
    </>
  );
}
