import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">NAVID</h3>
          <p className="text-sm text-gray-500">
            Your trusted fashion destination for quality and style.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-black transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-black transition">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-black transition">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/support" className="hover:text-black transition">
                Support
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-black transition">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-black transition">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:text-black transition">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="hover:text-black transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-black transition">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-300 pt-6">
        © {new Date().getFullYear()} NAVID. All rights reserved.
      </div>
    </footer>
  );
}
