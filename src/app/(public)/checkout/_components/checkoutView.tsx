"use client";

import { memo, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import BreadCrumbGlobal from "@/components/BreadCrumbGlobal";
import { useCarts } from "@/hooks/useCarts";
import { usePlaceOrder } from "@/hooks/useOrders";
import { useSession } from "@/hooks/useSession";
import {
  checkoutSchema,
  CheckoutFormData,
} from "@/lib/zodSchemas/checkoutSchema";
import Link from "next/link";

const CheckoutView = () => {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const userId = session?.id ? Number(session.id) : undefined;

  const {
    data: cartData,
    isLoading: cartLoading,
    refetch: refetchCart,
  } = useCarts(userId);

  const cartItems = useMemo(() => cartData?.data?.items || [], [cartData]);
  const { mutate: placeOrder, status } = usePlaceOrder();
  const isPlacingOrder = status === "pending";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      shippingMethod: "standard",
    },
  });

  const watchedShipping = watch("shippingMethod");

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc: number, item: any) =>
          acc + (item.variant?.price || 0) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const shippingCost = watchedShipping === "express" ? 20 : 5;
  const total = subtotal + shippingCost;

  const onSubmit = useCallback(
    async (formData: CheckoutFormData) => {
      if (cartItems.length === 0) return alert("Your cart is empty");
      if (!userId) return alert("You must be logged in to place an order.");

      const payload = {
        userId: userId,
        ...formData,
        metadata: {
          cartItems: cartItems.map((item: any) => ({
            variantId: item.variant.id,
            quantity: item.quantity,
          })),
        },
      };

      placeOrder(payload, {
        onSuccess: () => {
          reset();
          refetchCart();
          router.push("/orders");
        },
        onError: (err: any) => {
          console.error("Order error:", err);
          alert("Order failed. Please check your details and try again.");
        },
      });
    },
    [cartItems, placeOrder, reset, router, refetchCart, userId],
  );

  if (sessionLoading || (userId && cartLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        <p className="ml-3">Loading checkout...</p>
      </div>
    );
  }

  if (!session?.id && !sessionLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <p className="text-xl mb-4">Please log in to complete your checkout.</p>
        <Link
          href="/login"
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
        <Link href="/shop" className="px-8 py-3 bg-black text-white rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <BreadCrumbGlobal />
      <div className="bg-white min-h-screen text-gray-800">
        <section className="px-6 md:px-16 py-10 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-10 text-center">Checkout</h1>

          <form
            className="grid md:grid-cols-5 gap-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="md:col-span-3 space-y-5">
              <h3 className="text-lg font-semibold border-b pb-2">
                Shipping Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <input
                    placeholder="Full Name"
                    className={`w-full border p-2 rounded-lg ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    placeholder="Email"
                    className={`w-full border p-2 rounded-lg ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  placeholder="Address"
                  className={`w-full border p-2 rounded-lg ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    placeholder="City"
                    className={`w-full border p-2 rounded-lg ${
                      errors.city ? "border-red-500" : ""
                    }`}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    placeholder="ZIP"
                    className={`w-full border p-2 rounded-lg ${
                      errors.zip ? "border-red-500" : ""
                    }`}
                    {...register("zip")}
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zip.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    placeholder="Country"
                    className={`w-full border p-2 rounded-lg ${
                      errors.country ? "border-red-500" : ""
                    }`}
                    {...register("country")}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-bold">Shipping Method</label>
                <select
                  className="w-full border p-2 rounded-lg mt-1"
                  {...register("shippingMethod")}
                >
                  <option value="standard">Standard Shipping ($5.00)</option>
                  <option value="express">Express Shipping ($20.00)</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gray-50 p-6 rounded-2xl sticky top-24 border">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm border-b pb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-4 text-lg font-black">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isPlacingOrder ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default memo(CheckoutView);
