"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { NavLink } from "@/types/navbar";

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  onClose: () => void;
}

const MobileMenu = ({ isOpen, links, onClose }: MobileMenuProps) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div className="p-4 flex flex-col gap-2">
        {links.map((link) => (
          <div key={link.label} className="flex flex-col">
            {link.submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(link.label)}
                  className="py-2 px-3 rounded hover:bg-gray-100 font-medium text-gray-900 transition-colors text-left flex items-center justify-between"
                >
                  {link.label}
                  <span
                    className={`transform transition-transform ${
                      openSubmenus[link.label] ? "rotate-180" : ""
                    }`}
                  >
                    &#x25BE;
                  </span>
                </button>
                {openSubmenus[link.label] && (
                  <div className="ml-4 flex flex-col gap-1 mt-1 border-l-2 border-gray-100 pl-2">
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.label}
                        href={sublink.href}
                        onClick={onClose}
                        className="py-1 px-3 rounded hover:bg-gray-100 font-medium text-gray-700 transition-colors block"
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={link.href}
                onClick={onClose}
                className="py-2 px-3 rounded hover:bg-gray-100 font-medium text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MobileMenu);
