"use server";

import { prisma } from "@/lib/prisma";
import { getSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function deleteAccount(prevState: any, formData: FormData) {
  const session = await getSession();
  const auth = session as any;

  if (!auth || !auth.id) return { error: "Unauthorized" };

  const password = formData.get("confirmPassword") as string;
  if (!password) return { error: "Password is required." };

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(auth.id) },
    });

    if (!user) return { error: "User not found." };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Incorrect password." };

    await prisma.user.delete({ where: { id: user.id } });
    await deleteSession();
  } catch (error) {
    return { error: "An error occurred during deletion." };
  }

  redirect("/");
}
