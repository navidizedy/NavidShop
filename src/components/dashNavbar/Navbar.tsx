"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { deleteSession } from "@/lib/session";
import { useRouter } from "next/navigation";

type DropdownState = {
  menuOpen: boolean;
  actionsOpen: boolean;
  profileOpen: boolean;
};

export default function Navbar({ session }: { session: any }) {
  const router = useRouter();

  const [openState, setOpenState] = useState<DropdownState>({
    menuOpen: false,
    actionsOpen: false,
    profileOpen: false,
  });

  const refs = {
    actions: useRef<HTMLDivElement>(null),
    profile: useRef<HTMLDivElement>(null),
    mobileMenu: useRef<HTMLDivElement>(null),
  };

  const toggleRefs = {
    hamburger: useRef<HTMLButtonElement>(null),
    profileIcon: useRef<HTMLButtonElement>(null),
    actionsToggle: useRef<HTMLButtonElement>(null),
    mobileActionsToggle: useRef<HTMLButtonElement>(null),
  };

  const closeAll = useCallback(() => {
    setOpenState({
      menuOpen: false,
      actionsOpen: false,
      profileOpen: false,
    });
  }, []);

  const toggleDropdown =
    (key: keyof DropdownState) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenState((prev) => ({
        ...prev,
        [key]: !prev[key],
        ...(key === "menuOpen" && { actionsOpen: false }),
      }));
    };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const excludedElements = [
        toggleRefs.hamburger.current,
        toggleRefs.profileIcon.current,
        toggleRefs.actionsToggle.current,
        toggleRefs.mobileActionsToggle.current,
      ].filter((ref): ref is HTMLButtonElement => ref !== null);

      if (excludedElements.some((el) => el.contains(target))) return;

      const allRefs = [
        refs.actions.current,
        refs.profile.current,
        refs.mobileMenu.current,
      ].filter((ref): ref is HTMLDivElement => ref !== null);

      if (allRefs.every((ref) => !ref.contains(target))) {
        closeAll();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAll]);

  const handleLogout = async () => {
    await deleteSession();
    closeAll();
    router.push("/");
  };

  const linkClass = "block px-4 py-2 hover:bg-gray-700 transition-colors";
  const mobileLinkClass = "block px-3 py-2 hover:bg-gray-800 rounded";

  return (
    <nav className="bg-gray-900 text-white shadow-md relative h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/dashboard"
          onClick={closeAll}
          className="flex-shrink-0 font-bold text-xl hover:text-gray-400 transition-colors"
        >
          NAVID
        </Link>

        <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
          <Link
            href="/dashboard"
            onClick={closeAll}
            className="hover:text-gray-400"
          >
            Dashboard
          </Link>

          <div className="relative" ref={refs.actions}>
            <button
              ref={toggleRefs.actionsToggle}
              onClick={toggleDropdown("actionsOpen")}
              className="flex items-center hover:text-gray-400 focus:outline-none"
            >
              Actions
              <FaChevronDown
                className={`ml-1 transition-transform duration-300 ${openState.actionsOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`absolute mt-2 w-56 bg-gray-800 rounded shadow-lg z-50 overflow-hidden transform transition-all duration-300 ${openState.actionsOpen ? "opacity-100 scale-100 pointer-events-auto origin-top" : "opacity-0 scale-95 pointer-events-none origin-top"}`}
            >
              <Link
                href="/dashboard/products/new"
                onClick={closeAll}
                className={linkClass}
              >
                Add Product
              </Link>
              <Link
                href="/dashboard/products"
                onClick={closeAll}
                className={linkClass}
              >
                Manage Products
              </Link>
              <Link
                href="/dashboard/categories"
                onClick={closeAll}
                className={linkClass}
              >
                Add Category
              </Link>
              <Link
                href="/dashboard/colors"
                onClick={closeAll}
                className={linkClass}
              >
                Add Color
              </Link>
              <Link
                href="/dashboard/sizes"
                onClick={closeAll}
                className={linkClass}
              >
                Add Size
              </Link>
              <Link
                href="/dashboard/orders"
                onClick={closeAll}
                className={linkClass}
              >
                View Orders
              </Link>
              <Link
                href="/dashboard/users"
                onClick={closeAll}
                className={linkClass}
              >
                Manage Users
              </Link>

              <Link
                href="/dashboard/admins"
                onClick={closeAll}
                className={`${linkClass} text-red-400`}
              >
                Manage Admins
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative z-50" ref={refs.profile}>
            <button
              ref={toggleRefs.profileIcon}
              onClick={toggleDropdown("profileOpen")}
              className="hover:text-gray-400 focus:outline-none"
            >
              <FaUserCircle className="text-2xl" />
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg overflow-hidden transform transition-all duration-300 ${openState.profileOpen ? "opacity-100 scale-100 pointer-events-auto origin-top-right" : "opacity-0 scale-95 pointer-events-none origin-top-right"}`}
            >
              <div className="px-4 py-2 bg-gray-900 text-sm font-semibold border-b border-gray-700">
                {session.name}
              </div>
              <Link href="/" onClick={closeAll} className={linkClass}>
                Back to Home
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className={linkClass}
              >
                Logout
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              ref={toggleRefs.hamburger}
              onClick={toggleDropdown("menuOpen")}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    openState.menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={refs.mobileMenu}
        className={`md:hidden absolute top-16 left-0 w-full bg-gray-900 transform transition-all duration-300 z-40 ${openState.menuOpen ? "opacity-100 scale-100 pointer-events-auto origin-top" : "opacity-0 scale-95 pointer-events-none origin-top"}`}
      >
        <div className="px-2 pt-1 pb-2 space-y-1">
          <Link
            href="/dashboard"
            onClick={closeAll}
            className={mobileLinkClass}
          >
            Dashboard
          </Link>
          <div className="relative">
            <button
              ref={toggleRefs.mobileActionsToggle}
              onClick={toggleDropdown("actionsOpen")}
              className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-800 rounded"
            >
              Actions{" "}
              <FaChevronDown
                className={`ml-1 transition-transform duration-300 ${openState.actionsOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`mt-1 ml-4 w-auto bg-gray-800 rounded shadow-inner overflow-hidden transform transition-all duration-300 ${openState.actionsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="py-1">
                <Link
                  href="/dashboard/products/new"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  Add Product
                </Link>
                <Link
                  href="/dashboard/products"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  Manage Products
                </Link>
                <Link
                  href="/dashboard/categories"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  Add Category
                </Link>
                <Link
                  href="/dashboard/colors"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  Add Color
                </Link>
                <Link
                  href="/dashboard/sizes"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  Add Size
                </Link>
                <Link
                  href="/dashboard/orders"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  View Orders
                </Link>
                <Link
                  href="/dashboard/users"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700"
                >
                  Manage Users
                </Link>
                <Link
                  href="/dashboard/admins"
                  onClick={closeAll}
                  className="block px-3 py-2 hover:bg-gray-700 text-red-400"
                >
                  Manage Admins
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
