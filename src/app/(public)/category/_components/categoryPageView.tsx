"use client";

import { useTransition } from "react";
import Card from "@/components/Card";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { useRouter, usePathname } from "next/navigation";

export default function CategoryPageView({
  category,
  products = [],
  currentPage,
  totalPages,
}: {
  category: string;
  products: any[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const title = category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Collection`
    : "All Products";

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`${pathname}?page=${page}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <>
      <BreadCrumbGlobal />

      <div className="bg-white text-gray-800 min-h-screen">
        <section className="px-6 md:px-16 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Explore our curated selection of {category || "premium items"}{" "}
            designed for quality and style.
          </p>
        </section>

        <section className="px-6 md:px-16 pb-20">
          <div className="max-w-7xl mx-auto">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-2xl">
                  🔍
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h2>
                <Link
                  href="/shop"
                  className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md"
                >
                  Explore All Products
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {isPending
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-3 animate-pulse"
                        >
                          <div className="aspect-[4/5] w-full bg-gray-200 rounded-2xl" />
                          <div className="h-4 w-3/4 bg-gray-100 rounded" />
                          <div className="h-4 w-1/2 bg-gray-100 rounded" />
                        </div>
                      ))
                    : products.map((product) => {
                        const v = product.bestVariant;
                        if (!v || !product.images?.[0]?.url) return null;

                        return (
                          <Card
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={v.price}
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

                <div className="text-center mt-16">
                  <Link
                    href="/shop"
                    className="inline-block px-8 py-3 rounded-xl bg-black text-white font-bold hover:scale-105 transition-transform shadow-md"
                  >
                    Back to All Shop →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
