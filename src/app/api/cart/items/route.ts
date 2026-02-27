import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { variantId, quantity } = await req.json();

  let cart = await prisma.cart.findUnique({
    where: { userId: Number(user.id) },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: Number(user.id) },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, variantId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity },
    });
  }

  return NextResponse.json({ message: "Added to cart" });
}
