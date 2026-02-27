"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { colorSchema } from "@/lib/zodSchemas/colorSchema";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function addColorAction(name: string) {
  await verifyAdmin();
  const validated = colorSchema.parse({ name });
  await prisma.color.create({ data: { name: validated.name } });
  revalidateTag("colors");
  revalidatePath("/admin/colors");
  return { success: true, message: "Color added successfully" };
}

export async function updateColorAction(id: number, name: string) {
  await verifyAdmin();
  const validated = colorSchema.parse({ name });
  await prisma.color.update({ where: { id }, data: { name: validated.name } });
  revalidateTag("colors");
  revalidatePath("/admin/colors");
  return { success: true, message: "Color updated successfully" };
}

export async function deleteColorAction(id: number) {
  await verifyAdmin();
  await prisma.color.delete({ where: { id } });
  revalidateTag("colors");
  revalidatePath("/admin/colors");
  return { success: true, message: "Color deleted successfully" };
}
