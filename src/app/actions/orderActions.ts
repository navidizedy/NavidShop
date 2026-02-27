"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { OrderStatus } from "@prisma/client";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function updateOrderStatusAction(id: number, status: OrderStatus) {
  await verifyAdmin();

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    throw new Error("Failed to update order status");
  }
}

export async function deleteOrderAction(id: number) {
  await verifyAdmin();

  try {
    await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Delete failed: Database constraint issue.");
  }
}
