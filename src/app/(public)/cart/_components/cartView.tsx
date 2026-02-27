"use client";

import { memo, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import { useCarts } from "@/hooks/useCarts";
import { CartItem as GlobalCartItem } from "@/types";

type LocalCartItem = GlobalCartItem & {
  variant: {
    count: number;
  };
};

interface CartItemProps {
  item: LocalCartItem;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (id: number, qty: number) => void;
  onDelete: (id: number) => void;
}

const CartItem = memo(
  ({ item, isUpdating, isDeleting, onUpdate, onDelete }: CartItemProps) => {
    const product = item.variant.product;
    const img = product.images?.[0]?.url || "/placeholder.png";
    const isBusy = isUpdating || isDeleting;

    const stockLimit = item.variant.count ?? 0;
    const isAtLimit = item.quantity >= stockLimit;

    return (
      <div
        className={`flex flex-col md:flex-row items-center md:justify-between border p-4 rounded-2xl shadow-sm transition bg-white ${
          isDeleting ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center w-full md:w-auto">
          <Image
            src={img}
            alt={product.name}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-xl bg-gray-100"
          />
          <div className="ml-4 flex-1">
            <h2 className="font-semibold text-lg line-clamp-1">
              {product.name}
            </h2>
            <p className="text-gray-500 text-sm italic">
              {item.variant.color?.name} / {item.variant.size?.name}
            </p>
            {stockLimit <= 5 && stockLimit > 0 && (
              <p className="text-orange-600 text-[10px] font-bold mt-1 uppercase tracking-wider">
                Only {stockLimit} left in stock
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 mt-4 md:mt-0">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border">
            <button
              disabled={isBusy || item.quantity <= 1}
              onClick={() => onUpdate(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
            >
              –
            </button>
            <span className="w-8 text-center font-bold text-sm">
              {isUpdating ? "..." : item.quantity}
            </span>
            <button
              disabled={isBusy || isAtLimit}
              onClick={() => onUpdate(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-20 transition-colors"
            >
              +
            </button>
          </div>
          {isAtLimit && (
            <span className="text-[10px] text-red-500 font-medium">
              Max stock reached
            </span>
          )}
        </div>

        <div className="text-right mt-4 md:mt-0 min-w-[100px]">
          <p className="font-bold text-lg">
            ${(item.variant.price * item.quantity).toFixed(2)}
          </p>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isBusy}
            className="text-xs text-red-400 hover:text-red-600 transition underline font-medium"
          >
            {isDeleting ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    );
  },
);

const CartView = ({ initialSession }: { initialSession: any }) => {
  const userId = initialSession?.user?.id || initialSession?.id;
  const { data, isLoading, updateCartItemMutation, deleteCartItemMutation } =
    useCarts(userId ? Number(userId) : undefined);

  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartItems = useMemo(
    () => (data?.data?.items as LocalCartItem[]) ?? [],
    [data],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (item.variant?.price || 0) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const handleUpdateQuantity = useCallback(
    (itemId: number, newQty: number) => {
      const item = cartItems.find((i) => i.id === itemId);
      const stockLimit = item?.variant?.count ?? 0;
      if (newQty < 1) return;
      if (newQty > stockLimit) {
        toast.error(`Sorry, only ${stockLimit} available.`);
        return;
      }

      setUpdatingItemId(itemId);
      updateCartItemMutation.mutate(
        { id: itemId, quantity: newQty },
        {
          onSuccess: () => toast.success("Cart updated"),
          onSettled: () => setUpdatingItemId(null),
        },
      );
    },
    [updateCartItemMutation, cartItems],
  );

  const handleDelete = useCallback(
    (itemId: number) => {
      setDeletingItemId(itemId);
      deleteCartItemMutation.mutate(itemId, {
        onSuccess: () => toast.success("Removed from bag"),
        onSettled: () => setDeletingItemId(null),
      });
    },
    [deleteCartItemMutation],
  );

  if (!userId) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
        <BreadCrumbGlobal />
        <div className="flex flex-col items-center justify-center py-24 mt-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please Login First
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            You need to be logged in to manage your bag and proceed to checkout.
          </p>
          <Link
            href="/login"
            className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
        <BreadCrumbGlobal />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4" />
          <p className="font-bold text-gray-500">Loading your bag...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
        <BreadCrumbGlobal />
        <div className="flex flex-col items-center justify-center py-24 mt-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center px-4">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-2xl">
            🛍️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Bag is Empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything to your bag yet. Let's find
            something you'll love!
          </p>
          <Link
            href="/shop"
            className="px-10 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-md"
          >
            Explore the Shop →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <Toaster />
      <BreadCrumbGlobal />
      <h1 className="text-4xl md:text-5xl font-black mb-10 tracking-tight mt-6">
        Shopping Bag
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              isUpdating={updatingItemId === item.id}
              isDeleting={deletingItemId === item.id}
              onUpdate={handleUpdateQuantity}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-3xl h-fit border border-gray-100 sticky top-24">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">
            Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between py-6 border-t border-gray-200">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-black">${subtotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setIsCheckingOut(true)}
            className={`block w-full py-4 bg-black text-white text-center rounded-2xl font-bold transition-all hover:shadow-lg active:scale-95 ${
              isCheckingOut
                ? "opacity-50 pointer-events-none cursor-not-allowed"
                : "hover:bg-gray-900"
            }`}
          >
            {isCheckingOut ? "Processing..." : "Checkout Now"}
          </Link>
          <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest">
            Secure Checkout • 30-Day Returns
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartView;
