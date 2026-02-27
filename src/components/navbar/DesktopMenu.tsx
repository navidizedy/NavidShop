import { NavLink } from "@/types/navbar";
import Link from "next/link";

import { memo } from "react";

const DesktopMenu = ({ links }: { links: NavLink[] }) => {
  return (
    <>
      {links.map((link) => (
        <div key={link.label} className="group relative">
          {link.submenu ? (
            <>
              <span className="font-medium text-gray-900 hover:text-red-500 cursor-pointer transition-colors flex items-center">
                {link.label}
                <span className="ml-1">&#x25BE;</span>
              </span>

              <div className="absolute left-0 top-full mt-2 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible transform translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-10 min-w-[140px]">
                {link.submenu.map((sublink) => (
                  <Link
                    key={sublink.label}
                    href={sublink.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {sublink.label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href={link.href}
              className="font-medium text-gray-900 hover:text-red-500 transition-colors"
            >
              {link.label}
            </Link>
          )}
        </div>
      ))}
    </>
  );
};

export default memo(DesktopMenu);
