"use server";

import { prisma } from "@/lib/prisma";
import { getSession, updateSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { profileSchema } from "@/lib/zodSchemas/profileSchema";

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.id) return { error: "Unauthorized" };

  const data = Object.fromEntries(formData);
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues[0];
    return { error: issue.message, field: issue.path[0] };
  }

  const { name, email, oldPassword, newPassword } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(session.id) },
    });
    if (!user) return { error: "User not found" };

    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser)
        return { error: "Email already in use", field: "email" };
    }

    const updateData: any = { name, email };

    if (newPassword && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return { error: "Incorrect current password", field: "oldPassword" };
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    await updateSession({
      name: updatedUser.name ?? undefined,
      email: updatedUser.email ?? undefined,
    });

    revalidatePath("/", "layout");
    return { success: "Profile updated! ✨" };
  } catch (error) {
    return { error: "An unexpected error occurred." };
  }
}
