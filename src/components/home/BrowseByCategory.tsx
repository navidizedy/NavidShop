import { getCategories } from "@/app/actions/getCategories";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import * as motion from "framer-motion/client";

export default async function BrowseByCategory() {
  const categories = await getCategories(4);

  const displayCategories = categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
    image:
      cat.imageUrl && cat.imageUrl.trim() !== "" ? cat.imageUrl : "/images.jpg",
    slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white py-20 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
            Browse By Category
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Find exactly what you're looking for.
          </p>
        </div>

        {displayCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center px-4 shadow-sm">
            <div className="bg-gray-50 p-4 rounded-full shadow-sm mb-4">
              <LayoutGrid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Collections Coming Soon
            </h3>
            <Link href="/shop">
              <button className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md">
                Go to Shop
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="absolute inset-0 z-20"
                >
                  <span className="sr-only">Shop {cat.label}</span>
                </Link>
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-5 left-5 z-30 transition-transform duration-300 group-hover:-translate-y-2">
                  <p className="text-white font-black text-xl uppercase tracking-wide">
                    {cat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
