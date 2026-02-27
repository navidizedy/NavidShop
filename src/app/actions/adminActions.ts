"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { getSession, updateSession } from "@/lib/session";
import { adminSchema, updateAdminSchema } from "@/lib/zodSchemas/adminSchema";

const MAIN_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;

async function verifyAdminRole() {
  const session = await getSession();
  if (!session || (session as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function addAdminAction(data: any) {
  await verifyAdminRole();
  const validated = adminSchema.parse(data);
  const hashedPassword = await bcrypt.hash(validated.password, 10);

  await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  revalidatePath("/dashboard/admins");
  return { success: true, message: "Admin created successfully" };
}

export async function updateAdminAction(id: number, updates: any) {
  const session = await verifyAdminRole();
  const validated = updateAdminSchema.parse(updates);

  const data: any = {
    name: validated.name,
    email: validated.email,
  };

  if (validated.password) {
    data.password = await bcrypt.hash(validated.password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    const loggedInId = (session as any).id || (session as any).sub;
    if (loggedInId && String(loggedInId) === String(id)) {
      await updateSession({
        name: updatedUser.name ?? undefined,
        email: updatedUser.email ?? undefined,
      });
    }

    revalidatePath("/dashboard/admins");
    return { success: true, message: "Admin updated successfully" };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, message: "Update failed." };
  }
}

export async function deleteAdminAction(id: number) {
  const session = await verifyAdminRole();
  const adminToDelete = await prisma.user.findUnique({ where: { id } });

  if (adminToDelete?.email.toLowerCase() === MAIN_ADMIN_EMAIL?.toLowerCase()) {
    throw new Error("The main admin account cannot be deleted.");
  }

  const loggedInId = (session as any).id || (session as any).sub;
  if (loggedInId && String(loggedInId) === String(id)) {
    throw new Error("You cannot delete your own account from this panel.");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/dashboard/admins");
  return { success: true, message: "Admin deleted successfully" };
}
