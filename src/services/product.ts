import { Product, ProductInput, ProductVariant } from "@/types";

async function handleResponse(res: Response) {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }
  if (!res.ok)
    throw new Error(data?.message || `Request failed with ${res.status}`);
  return data;
}

export async function getAllProducts(filters?: {
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();

  params.set("page", String(filters?.page ?? 1));
  params.set("limit", String(filters?.limit ?? 12));
  params.set("sort", filters?.sort ?? "newest");

  filters?.categories?.forEach((c) => params.append("categories", c));
  filters?.colors?.forEach((c) => params.append("colors", c));
  filters?.sizes?.forEach((s) => params.append("sizes", s));

  const res = await fetch(`/api/products?${params.toString()}`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function addProduct(product: any) {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("details", product.details || "");
  formData.append("categories", JSON.stringify(product.categories));
  formData.append("variants", JSON.stringify(product.variants));

  if (product.images) {
    for (const file of product.images) {
      if (file instanceof File) formData.append("images", file);
    }
  }

  const res = await fetch("/api/products", { method: "POST", body: formData });
  return handleResponse(res);
}

export async function getProductById(id: number) {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
  return handleResponse(res);
}

export async function updateProduct(
  id: number,
  productData: FormData | Partial<ProductInput>,
) {
  const isFormData = productData instanceof FormData;
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    body: isFormData ? productData : JSON.stringify(productData),
    ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
  });
  return handleResponse(res);
}

export async function deleteProduct(id: number) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function updateVariant(
  productId: number,
  variantId: number,
  variantData: Partial<ProductVariant>,
) {
  const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variantData),
  });
  return handleResponse(res);
}

export async function deleteVariant(productId: number, variantId: number) {
  const res = await fetch(`/api/products/${productId}/variants/${variantId}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
