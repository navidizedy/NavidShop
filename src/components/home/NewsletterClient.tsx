"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";

export default function NewsletterClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      <h2 className="text-2xl md:text-3xl font-extrabold mb-6">
        STAY UP TO DATE ABOUT OUR LATEST OFFERS
      </h2>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-3 rounded-md font-medium transition transform hover:scale-105 hover:opacity-90 w-full sm:w-auto justify-center"
        >
          <FaInstagram className="w-5 h-5" />
          Follow on Instagram
        </a>

        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-md font-medium transition transform hover:scale-105 hover:bg-blue-600 w-full sm:w-auto justify-center"
        >
          <FaTelegramPlane className="w-5 h-5" />
          Join Telegram
        </a>
      </div>
    </motion.div>
  );
}
