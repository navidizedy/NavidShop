"use client";

import { useState, useTransition, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

import OrdersDeleteModal from "./ordersDeleteModal";
import { updateOrderStatusAction } from "@/app/actions/orderActions";
import OrderRow from "./orderRow";
import Pagination from "@/components/Pagination";

export interface Order {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  shippingMethod?: string;
  total: number;
  status: string;
  items: any[];
}

export default function OrdersView({
  initialOrders,
  currentPage,
  totalPages,
}: {
  initialOrders: Order[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const handleStatusChange = useCallback((orderId: number, status: string) => {
    setBusyId(orderId);
    startTransition(async () => {
      try {
        await updateOrderStatusAction(orderId, status as OrderStatus);
        toast.success("Status updated");
      } catch (err: any) {
        toast.error(err.message || "Update failed");
      } finally {
        setBusyId(null);
      }
    });
  }, []);

  const handleDeleteClick = useCallback((order: Order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  }, []);

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`/dashboard/orders?page=${page}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <Toaster />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
          <div className="mt-1 h-5 flex items-center">
            {totalPages === 0 ? (
              <div className="h-4 w-32 bg-gray-800 animate-pulse rounded" />
            ) : (
              <p className="text-gray-400 text-sm">
                Viewing page{" "}
                <span className="text-white font-medium">{currentPage}</span> of{" "}
                <span className="text-white font-medium">{totalPages}</span>
                {isPending && (
                  <span className="ml-2 text-xs text-blue-500 animate-pulse">
                    (Loading...)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {isPending ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-800 rounded-xl p-6 h-64 border border-gray-700"
            />
          ))}
        </div>
      ) : initialOrders.length === 0 ? (
        <div className="text-center py-24 text-gray-400 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
          No orders found for this page.
        </div>
      ) : (
        <div className="space-y-6">
          {initialOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isBusy={busyId === order.id}
              handleStatusChange={handleStatusChange}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 mb-10 border-t border-gray-800 pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="dark"
          />
        </div>
      )}

      {orderToDelete && (
        <OrdersDeleteModal
          isOpen={deleteModalOpen}
          orderId={orderToDelete.id}
          onClose={() => {
            setDeleteModalOpen(false);
            setOrderToDelete(null);
          }}
        />
      )}
    </div>
  );
}
