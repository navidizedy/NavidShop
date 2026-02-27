import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import Link from "next/link";
import * as motion from "framer-motion/client";

export default function NewsletterSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-black text-white py-16 px-6 md:px-12 text-center"
    >
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 uppercase tracking-tight">
          Stay up to date about our latest offers
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <Link
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-3 rounded-md font-medium transition transform hover:scale-[1.03] w-full sm:w-auto justify-center"
          >
            <FaInstagram className="w-5 h-5" />
            Instagram
          </Link>
          <Link
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-md font-medium transition transform hover:scale-[1.03] hover:bg-blue-600 w-full sm:w-auto justify-center"
          >
            <FaTelegramPlane className="w-5 h-5" />
            Telegram
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
