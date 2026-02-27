"use client";

import { useState, useRef, useEffect, memo } from "react";
import {
  CircleUserRound,
  LogIn,
  UserPlus,
  LogOut,
  Box,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/lib/session";

interface MenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  action?: () => void;
  variant?: "default" | "danger";
}

const UserDropdown = ({ session }: { session: any }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    await deleteSession();
    setOpen(false);
    router.push("/");
  };

  const getMenuItems = (): MenuItem[] => {
    if (!session) {
      return [
        { label: "Login", href: "/login", icon: LogIn },
        { label: "Sign Up", href: "/signup", icon: UserPlus },
      ];
    }
    const items: MenuItem[] = [];
    if (session.role === "ADMIN") {
      items.push({
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      });
    } else {
      items.push(
        { label: "Profile", href: "/profile", icon: CircleUserRound },
        { label: "Orders", href: "/orders", icon: Box },
      );
    }
    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <CircleUserRound className="w-6 h-6 text-gray-800" />
      </button>

      {open && (
        <div className="absolute right-0 w-48 bg-white shadow-xl rounded-lg mt-2 border border-gray-200 z-50 overflow-hidden">
          {session && (
            <div className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-100 mx-2 my-2 rounded truncate">
              {session.name || session.email}
            </div>
          )}

          <div className="flex flex-col">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.href && handleNavigate(item.href)}
                className="flex items-center gap-2 text-sm py-3 px-4 w-full text-left hover:bg-gray-50"
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}

            {session && (
              <>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left text-sm py-3 px-4 hover:bg-gray-50 text-red-600 hover:text-red-700"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(UserDropdown);
