"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { uploadImage } from "@/lib/uploadImage";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function addCategoryAction(formData: FormData) {
  await verifyAdmin();
  const name = formData.get("name") as string;
  const image = formData.get("image") as File;

  let imageUrl = "";
  if (image && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  await prisma.category.create({
    data: { name, imageUrl },
  });

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  return { success: true, message: "Category created!" };
}

export async function updateCategoryAction(id: number, formData: FormData) {
  await verifyAdmin();
  const name = formData.get("name") as string;
  const image = formData.get("image") as File;

  const data: any = { name };

  if (image && image.size > 0) {
    data.imageUrl = await uploadImage(image);
  }

  await prisma.category.update({ where: { id }, data });

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  return { success: true, message: "Category updated!" };
}

export async function deleteCategoryAction(id: number) {
  await verifyAdmin();
  await prisma.category.delete({ where: { id } });

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  return { success: true, message: "Category deleted!" };
}
