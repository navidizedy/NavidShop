export interface PlaceOrderPayload {
  userId: number;
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  shippingMethod: "standard" | "express";
  couponCode?: string;
  metadata?: Record<string, any>;
}

export interface OrderItem {
  variantId: number;
  price: number;
  quantity: number;
  name: string;
  color?: string | null;
  size?: string | null;
  image?: string | null;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: "PENDING" | "PREPARING" | "SHIPPED" | "FULFILLED";
  paymentStatus: string;
  metadata: Record<string, any> | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;

  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

export const placeOrder = async (payload: PlaceOrderPayload) => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: PlaceOrderResponse = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to place order");

  return data.order;
};
export const getUserOrders = async (page: number = 1, limit: number = 5) => {
  const res = await fetch(`/api/orders/user?page=${page}&limit=${limit}`);

  if (!res.ok) {
    throw new Error("Failed to fetch user orders");
  }

  const data = await res.json();
  return {
    orders: data.orders as Order[],
    totalCount: data.totalCount as number,
  };
};
