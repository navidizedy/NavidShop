"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const STATS = [
  { num: "200+", label: "International Brands" },
  { num: "2,000+", label: "High-Quality Products" },
  { num: "30,000+", label: "Happy Customers" },
];

export default function HeroSection() {
  return (
    <section className="bg-gray-100 pt-20 md:pt-24 lg:pt-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 pb-10 md:pb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            FIND CLOTHES <br />
            THAT MATCHES <br />
            <span className="text-gray-800">YOUR STYLE</span>
          </h1>
          <p className="text-gray-600 max-w-md mx-auto md:mx-0">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Link href="/shop">
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition transform hover:scale-[1.02] active:scale-[0.98] font-medium">
              Shop Now
            </button>
          </Link>
          <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-6">
            {STATS.map((item, i) => (
              <div key={i}>
                <p className="text-xl font-bold text-gray-900">{item.num}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex justify-center md:justify-end"
        >
          <Image
            src="/images.jpg"
            alt="Models showcasing new collection"
            width={450}
            height={450}
            className="rounded-xl object-cover shadow-xl"
            priority
          />
        </motion.div>
      </div>

      <div className="bg-black text-white py-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 text-xl font-semibold tracking-widest">
          <span>VERSACE</span>
          <span>ZARA</span>
          <span>GUCCI</span>
          <span>PRADA</span>
          <span>CALVIN KLEIN</span>
        </div>
      </div>
    </section>
  );
}
