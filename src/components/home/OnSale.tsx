import { getOnSaleProducts } from "@/app/actions/getOnSaleProducts";
import type { OnSaleProduct } from "@/app/actions/getOnSaleProducts";
import Link from "next/link";
import Card from "@/components/Card";
import { Tag } from "lucide-react";
import * as motion from "framer-motion/client";

export default async function OnSale() {
  let items: OnSaleProduct[] = [];
  try {
    const data = await getOnSaleProducts(1, 4);
    items = data.products ?? [];
  } catch (error) {
    items = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="bg-white py-20 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
            On Sale
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Grab them before they&apos;re gone.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Deals are coming soon
            </h3>
            <Link href="/shop">
              <button className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md">
                Browse Full Shop
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {items.map((product) => {
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
            <div className="mt-12 text-center">
              <Link href="/on-sale">
                <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg active:scale-95">
                  View All Deals →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}
