"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { sizeSchema } from "@/lib/zodSchemas/sizeSchema";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function addSizeAction(name: string) {
  await verifyAdmin();
  const validated = sizeSchema.parse({ name });

  await prisma.size.create({
    data: { name: validated.name },
  });
  revalidateTag("sizes");
  revalidatePath("/admin/sizes");
  return { success: true, message: "Size added successfully" };
}

export async function updateSizeAction(id: number, name: string) {
  await verifyAdmin();
  const validated = sizeSchema.parse({ name });

  await prisma.size.update({
    where: { id },
    data: { name: validated.name },
  });
  revalidateTag("sizes");
  revalidatePath("/admin/sizes");
  return { success: true, message: "Size updated successfully" };
}

export async function deleteSizeAction(id: number) {
  await verifyAdmin();

  await prisma.size.delete({
    where: { id },
  });
  revalidateTag("sizes");
  revalidatePath("/admin/sizes");
  return { success: true, message: "Size deleted successfully" };
}
