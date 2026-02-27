"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import { useUserOrders } from "@/hooks/useOrders";
import Pagination from "@/components/Pagination";

interface OrderItem {
  variantId: number;
  name: string;
  image: string | null;
  color: string | null;
  size: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: "PENDING" | "PREPARING" | "SHIPPED" | "FULFILLED";
  total: number;
  items: OrderItem[];

  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  metadata?: {
    shippingMethod?: string;
  };
}

const OrdersView = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = useUserOrders(page);

  const orders: Order[] = (data?.orders as Order[]) || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const Skeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse border rounded-2xl p-6 space-y-4 bg-gray-50"
        >
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-20 w-full bg-gray-100 rounded-xl" />
        </div>
      ))}
    </div>
  );

  const ordersContent = useMemo(() => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-24 bg-red-50 rounded-3xl border-2 border-dashed border-red-100 text-center px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Failed to load orders
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="font-bold underline"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (orders.length === 0 && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <Link
            href="/shop"
            className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-2xl shadow-sm p-6 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between mb-6 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                  Order ID
                </p>
                <p className="font-black text-xl">#{order.id}</p>
              </div>
              <div className="md:text-right mt-2 md:mt-0">
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                  Date Placed
                </p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover rounded-xl bg-gray-50"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-xs italic">
                      {item.color} / {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">
                Shipping Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Recipient
                  </p>
                  <p className="font-bold text-sm text-gray-800">
                    {order.name}
                  </p>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Address
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {order.address}, {order.city}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.zip} {order.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                  Grand Total
                </p>
                <p className="font-black text-2xl">${order.total.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3">
                {order.metadata?.shippingMethod && (
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-lg">
                    {order.metadata.shippingMethod}
                  </span>
                )}
                <span
                  className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-2 ${
                    {
                      PENDING: "bg-yellow-50 text-yellow-600 border-yellow-100",
                      PREPARING: "bg-blue-50 text-blue-600 border-blue-100",
                      SHIPPED: "bg-purple-50 text-purple-600 border-purple-100",
                      FULFILLED: "bg-green-50 text-green-600 border-green-100",
                    }[order.status] ||
                    "bg-gray-50 text-gray-600 border-gray-100"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    );
  }, [orders, isLoading, error, page, totalPages]);

  return (
    <>
      <BreadCrumbGlobal />
      <div className="bg-white min-h-screen text-gray-800">
        <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-10 tracking-tight text-center">
            Your Orders
          </h1>
          <div className="space-y-8">
            {isLoading ? <Skeleton /> : ordersContent}
          </div>
        </section>
      </div>
    </>
  );
};

export default memo(OrdersView);
