"use client";

import { memo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { NavLink } from "@/types/navbar";
import DesktopMenu from "./DesktopMenu";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";

const SearchBar = dynamic(() => import("./SearchBar"), { ssr: false });
const UserDropdown = dynamic(() => import("./UserDropdown"), { ssr: false });

interface NavbarClientProps {
  session: any;
  links: NavLink[];
}

const NavbarClient = ({ session, links }: NavbarClientProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        scrolled
          ? "shadow-md border-b border-gray-200"
          : "border-b border-transparent",
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            Nav<span className="text-red-500">id</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6 relative">
          <DesktopMenu links={links} />
        </div>

        <div className="flex items-center gap-3">
          <SearchBar />

          {session?.role !== "ADMIN" && <CartButton session={session} />}

          <UserDropdown session={session} />
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} links={links} onClose={closeMenu} />
    </header>
  );
};

export default memo(NavbarClient);
