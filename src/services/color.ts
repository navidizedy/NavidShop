import { Color } from "@/types";

export async function getAllColors(): Promise<{
  message: string;
  data: Color[];
}> {
  const res = await fetch("/api/color");

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Failed to parse JSON from server");
  }

  if (!res.ok) {
    throw new Error(data?.message || `Failed to fetch colors (${res.status})`);
  }

  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error("No colors found");
  }

  return data;
}
export async function addColor(
  name: string,
): Promise<{ message: string; data: Color }> {
  const res = await fetch("/api/color", {
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
    throw new Error(data.message || "Failed to add color");
  }
  return data;
}
export async function updateColor(
  id: number,
  name: string,
): Promise<{ message: string; data: Color }> {
  const res = await fetch(`/api/color/${id}`, {
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
    throw new Error(data.message || "Failed to update color");
  }

  return data;
}
export async function deleteColor(id: number): Promise<{
  message: string;
  data: Color;
}> {
  const res = await fetch(`/api/color/${id}`, {
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
    throw new Error(data.message || "Failed to delete color");
  }

  return data;
}
