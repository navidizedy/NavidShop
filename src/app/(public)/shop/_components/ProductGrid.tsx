"use client";

import { memo } from "react";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";

function ProductGridClient({
  products,
  total,
  isLoading,
  sort,
  setSort,
  page,
  setPage,
  clearAll,
}: any) {
  const totalPages = Math.ceil(total / 12);

  const skeletons = Array.from({ length: 12 });

  return (
    <div className="relative min-h-[600px] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">All Products</h2>
        <div className="flex items-center gap-4">
          <span
            className={`text-sm text-gray-500 transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}
          >
            {isLoading
              ? "Refreshing..."
              : `Showing ${products.length} of ${total}`}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-none bg-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Lowest Price">Lowest Price</option>
            <option value="Highest Price">Highest Price</option>
          </select>
        </div>
      </div>

      <div
        className={`flex-grow transition-all duration-300 ${isLoading && products.length > 0 ? "opacity-40 blur-[1px] pointer-events-none" : "opacity-100"}`}
      >
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletons.map((_, i) => (
              <div
                key={i}
                className="w-full h-[400px] bg-gray-100 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : products.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
            <h3 className="text-lg font-bold text-gray-900">
              No results found
            </h3>
            <button
              onClick={clearAll}
              className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p: any) => (
              <Card
                key={p.id}
                id={p.id}
                name={p.name}
                price={
                  sort === "Highest Price"
                    ? p._meta.highest
                    : p._meta.displayVariant.price
                }
                oldPrice={
                  sort === "Highest Price"
                    ? null
                    : p._meta.displayVariant.oldPrice
                }
                discount={
                  sort === "Highest Price"
                    ? null
                    : p._meta.displayVariant.discount
                }
                image={p.images?.[0]?.url}
                href={`/shop/${p.id}`}
                isOutOfStock={p._meta.isOutOfStock}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={`mt-auto pt-12 transition-opacity ${isLoading ? "opacity-30 pointer-events-none" : "opacity-100"}`}
      >
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="light"
          />
        )}
      </div>
    </div>
  );
}

export default memo(ProductGridClient);
