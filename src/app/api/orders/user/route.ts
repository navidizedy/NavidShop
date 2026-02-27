import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.order.count({
    where: { userId: Number(session.id) },
  });

  const orders = await prisma.order.findMany({
    where: { userId: Number(session.id) },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      items: true,
    },
  });

  return NextResponse.json({ orders, totalCount });
}
