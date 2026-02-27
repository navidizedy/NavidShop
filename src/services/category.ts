import {
  AddCategoryResponse,
  CategoryListResponse,
  DeleteCategoryResponse,
  UpdateCategoryResponse,
} from "@/types";

export async function addCategory(payload: FormData) {
  const res = await fetch("/api/category", {
    method: "POST",

    body: payload,
  });

  let data: AddCategoryResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to add category");
  }

  return data;
}

export async function getAllCategories() {
  const res = await fetch("/api/category", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data: CategoryListResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch categories");
  }

  if (!data.data) {
    throw new Error("No categories found");
  }

  return data;
}

export async function updateCategory(id: number, formData: FormData) {
  const res = await fetch(`/api/category/${id}`, {
    method: "PUT",

    body: formData,
  });

  let data: UpdateCategoryResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to update category");
  }

  return data;
}

export async function deleteCategory(id: number) {
  const res = await fetch(`/api/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data: DeleteCategoryResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete category");
  }

  return data;
}
