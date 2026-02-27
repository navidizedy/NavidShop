"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCarts } from "@/hooks/useCarts";
import { useMemo, memo } from "react";

const CartButton = ({ session }: { session: any }) => {
  const isAdmin = session?.role === "ADMIN";

  const userId = session?.id ? Number(session.id) : undefined;
  const { data } = useCarts(userId);

  const uniqueItemCount = useMemo(() => data?.data?.items?.length ?? 0, [data]);

  if (isAdmin) return null;

  return (
    <Link
      href="/cart"
      className="relative p-1 hover:bg-gray-100 rounded-md transition-colors"
    >
      <ShoppingCart className="w-6 h-6" />
      {uniqueItemCount > 0 && (
        <span
          key={uniqueItemCount}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300"
        >
          {uniqueItemCount}
        </span>
      )}
    </Link>
  );
};

export default memo(CartButton);
