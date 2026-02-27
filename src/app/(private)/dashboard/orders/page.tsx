import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import OrdersView from "./_components/ordersView";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const [totalOrders, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({
      skip,
      take: pageSize,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <OrdersView
      initialOrders={JSON.parse(JSON.stringify(orders))}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
