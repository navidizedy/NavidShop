import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function DELETE() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: Number(user.id) },
  });
  if (!cart) return NextResponse.json({ message: "No cart to clear" });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return NextResponse.json({ message: "Cart cleared" });
}
