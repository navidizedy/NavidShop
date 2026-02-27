import { Cart, CartItem } from "@/types";

export async function getCart(): Promise<{ message?: string; data: Cart }> {
  const res = await fetch("/api/cart", {
    method: "GET",
    credentials: "include",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Failed to parse JSON from server");
  }

  if (!res.ok) {
    throw new Error(data?.message || `Failed to fetch cart (${res.status})`);
  }

  return { message: "Cart fetched successfully", data };
}

export async function addToCart(
  variantId: number,
  quantity: number,
): Promise<{ message: string }> {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, quantity }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Failed to add to cart");
  }

  return data;
}

export async function updateCartItem(
  id: number,
  quantity: number,
): Promise<{ message: string }> {
  const res = await fetch(`/api/cart/items/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update cart item");
  }

  return data;
}

export async function deleteCartItem(id: number): Promise<{ message: string }> {
  const res = await fetch(`/api/cart/items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete cart item");
  }

  return data;
}

export async function clearCart(): Promise<{ message: string }> {
  const res = await fetch("/api/cart/clear", {
    method: "DELETE",
    credentials: "include",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Failed to clear cart");
  }

  return data;
}
