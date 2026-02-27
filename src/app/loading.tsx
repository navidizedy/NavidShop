"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        <p className="text-lg font-medium">Loading, please wait...</p>
      </motion.div>
    </section>
  );
}
