"use server";

import { prisma } from "@/lib/prisma";

export async function getAllUsers(page: number = 1, pageSize: number = 10) {
  try {
    const skip = (page - 1) * pageSize;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: { role: "USER" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: { select: { orders: true } },
          orders: { select: { total: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: pageSize,
      }),
      prisma.user.count({ where: { role: "USER" } }),
    ]);

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "N/A",
      email: user.email,
      joinedAt: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      orderCount: user._count.orders,
      totalSpent: user.orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0,
      ),
    }));

    return {
      users: formattedUsers,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return { users: [], totalPages: 0 };
  }
}
