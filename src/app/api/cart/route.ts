import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: Number(user.id) },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { include: { images: true } },
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(cart ?? { items: [] });
}
