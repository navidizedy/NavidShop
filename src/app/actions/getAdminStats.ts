"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminDashboardData() {
  try {
    const [
      productCount,
      adminCount,
      userCount,
      orderCount,
      revenueResult,
      topProductsRaw,
      recentOrders,
      lowStockItems,
      customerRoles,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),

      prisma.orderItem.groupBy({
        by: ["name", "image"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 4,
      }),

      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),

      prisma.productVariant.findMany({
        where: { count: { lt: 10 } },
        take: 5,
        include: {
          product: { select: { name: true } },
          color: { select: { name: true } },
          size: { select: { name: true } },
        },
        orderBy: { count: "asc" },
      }),

      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      }),
    ]);

    return {
      stats: {
        totalProducts: productCount,
        totalAdmins: adminCount,
        totalUsers: userCount,
        totalOrders: orderCount,
        totalRevenue: revenueResult?._sum?.total ?? 0,
      },
      topProducts: topProductsRaw.map((item) => ({
        name: item.name,
        image: item.image || "/placeholder.jpg",
        sold: item._sum.quantity || 0,
      })),
      recentOrders: recentOrders.map((order) => ({
        id: `#${order.id}`,
        customer: order.user?.name || "Guest",
        amount: `$${order.total}`,
        status: order.status,
      })),
      lowStock: lowStockItems.map((item) => ({
        name: item.product.name,
        variant: `${item.color?.name || ""} ${item.size?.name || ""}`,
        stock: item.count,
      })),
      userStats: customerRoles.reduce((acc: any, curr) => {
        acc[curr.role] = curr._count.id;
        return acc;
      }, {}),
    };
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return null;
  }
}
