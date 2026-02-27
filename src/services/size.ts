import { Size } from "@/types";

export async function getAllSizes(): Promise<{
  message: string;
  data: Size[];
}> {
  const res = await fetch("/api/size");
  let data;
  try {
    data = await res.json();
  } catch (error) {
    throw new Error("Failed to parse JSON from server");
  }
  if (!res.ok) {
    throw new Error(data?.message || `Failed to fetch sizes (${res.status})`);
  }
  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error("No colors found");
  }
  return data;
}
export async function addSize(
  name: string
): Promise<{ message: string; data: Size }> {
  const res = await fetch("/api/size", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  let data;
  try {
    data = await res.json();
  } catch (error) {
    throw new Error("Server did not return valid JSON");
  }
  if (!res.ok) {
    throw new Error(data.message || "Failed to add size");
  }
  return data;
}
export async function updateSize(
  id: number,
  name: string
): Promise<{ message: string; data: Size }> {
  const res = await fetch(`/api/size/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to update size");
  }

  return data;
}
export async function deleteSize(id: number): Promise<{
  message: string;
  data: Size;
}> {
  const res = await fetch(`/api/size/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete size");
  }

  return data;
}
