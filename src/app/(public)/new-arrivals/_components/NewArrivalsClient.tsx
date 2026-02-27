"use client";

import Link from "next/link";
import Card from "@/components/Card";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import type { NewArrivalProduct } from "@/app/actions/getNewArrivals";

interface NewArrivalsClientProps {
  products: NewArrivalProduct[];
  error: string | null;
}

export default function NewArrivalsClient({
  products,
  error,
}: NewArrivalsClientProps) {
  const noProducts = !error && products.length === 0;

  return (
    <>
      <BreadCrumbGlobal />
      <div className="bg-white text-gray-800 min-h-screen">
        <section className="px-6 md:px-16 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            🌿 NEW ARRIVALS
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Discover our latest collection — fresh designs, soft fabrics, and
            modern fits.
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
              <p className="text-gray-500 max-w-sm mx-auto">
                Could not retrieve new arrivals. Please try again later.
              </p>
            </div>
          ) : noProducts ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-2xl">
                ✨
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Coming Soon!
              </h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                We're currently preparing our newest pieces. Check out our full
                collection in the meantime!
              </p>
              <Link
                href="/shop"
                className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md"
              >
                Explore Full Collection →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {products.map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.bestVariant?.price ?? 0}
                    oldPrice={item.bestVariant?.oldPrice ?? null}
                    discount={item.bestVariant?.discount ?? null}
                    image={item.images?.[0]?.url ?? ""}
                    href={`/shop/${item.id}`}
                    isOutOfStock={item.isOutOfStock}
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 rounded-xl bg-black text-white font-bold hover:scale-105 transition-transform shadow-md"
                >
                  Explore Full Collection →
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
