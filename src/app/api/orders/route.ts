import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      address,
      city,
      zip,
      country,
      shippingMethod,
      couponCode,
      metadata,
    } = body;

    const cart = await prisma.cart.findUnique({
      where: { userId: Number(session.id) },
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 },
      );
    }

    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.variant.price * item.quantity,
      0,
    );
    const shippingCost = shippingMethod === "express" ? 20 : 5;
    const discount = couponCode?.toUpperCase() === "SAVE10" ? 10 : 0;
    const total = subtotal + shippingCost - discount;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        const updatedVariant = await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            count: {
              decrement: item.quantity,
            },
          },
        });

        if (updatedVariant.count < 0) {
          throw new Error(
            `Insufficient stock for ${item.variant.product.name} (${
              item.variant.size?.name || ""
            } ${item.variant.color?.name || ""})`,
          );
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId: Number(session.id),
          total,
          name,
          email,
          address,
          city,
          zip,
          country,
          shippingMethod,
          metadata: { ...metadata, shippingMethod, couponCode },
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              price: item.variant.price,
              quantity: item.quantity,
              name: item.variant.product.name,
              color: item.variant.color?.name || null,
              size: item.variant.size?.name || null,
              image: item.variant.product.images?.[0]?.url || null,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    revalidateTag("products");
    revalidateTag("on-sale-products");

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("ORDER_ERROR:", err.message);
    if (err.message.includes("Insufficient stock")) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to place order" },
      { status: 500 },
    );
  }
}
