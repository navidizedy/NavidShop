"use client";

import {
  FaBoxOpen,
  FaUsersCog,
  FaShoppingCart,
  FaUserFriends,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWallet,
} from "react-icons/fa";

interface DashHomeViewProps {
  stats: {
    totalProducts: number;
    totalAdmins: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
  };
  topProducts: Array<{
    name: string;
    image: string;
    sold: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: string;
    status: string;
  }>;
  lowStock: Array<{
    name: string;
    variant: string;
    stock: number;
  }>;
  userStats: {
    USER?: number;
    ADMIN?: number;
  };
}

export default function DashHomeView({
  stats,
  topProducts,
  recentOrders,
  lowStock,
}: DashHomeViewProps) {
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(stats.totalRevenue);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Welcome back, Admin 👋</h1>
        <p className="text-gray-400 mt-2">
          Real-time overview of your store's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Products",
            value: stats.totalProducts,
            icon: <FaBoxOpen className="text-indigo-400" />,
          },
          {
            title: "Admins",
            value: stats.totalAdmins,
            icon: <FaUsersCog className="text-pink-400" />,
          },
          {
            title: "Users",
            value: stats.totalUsers,
            icon: <FaUserFriends className="text-blue-400" />,
          },
          {
            title: "Orders",
            value: stats.totalOrders,
            icon: <FaShoppingCart className="text-green-400" />,
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg flex justify-between items-center transition hover:border-gray-500"
          >
            <div>
              <h2 className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                {stat.title}
              </h2>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="text-3xl opacity-40">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-6">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:bg-gray-900 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-tighter font-bold">
                        Best Seller
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400 text-lg">
                      {product.sold}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase">
                      Units Sold
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 italic">
                No sales data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-orange-400">
              Inventory Alerts
            </h2>
            <FaExclamationTriangle className="text-orange-500 animate-pulse" />
          </div>
          <div className="space-y-4">
            {lowStock.length > 0 ? (
              lowStock.map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-gray-200">
                      {item.name}
                    </p>
                    <span className="text-xs font-black text-orange-500 px-2 py-0.5 bg-orange-500/10 rounded uppercase">
                      {item.stock} Left
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{item.variant}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <FaCheckCircle className="text-green-400 text-3xl mb-2" />
                <p className="text-sm">Stock levels healthy</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-700">
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentOrders.map((order) => {
                  const statusConfig: Record<string, string> = {
                    PENDING:
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                    PREPARING:
                      "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    SHIPPED:
                      "bg-purple-500/10 text-purple-500 border-purple-500/20",
                    FULFILLED:
                      "bg-green-500/10 text-green-500 border-green-500/20",
                    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
                  };
                  const currentStyle =
                    statusConfig[order.status] ||
                    "bg-gray-500/10 text-gray-500 border-gray-500/20";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-900/30 transition"
                    >
                      <td className="py-4">
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                          ID: {order.id}
                        </p>
                      </td>
                      <td className="py-4 font-bold text-gray-200">
                        {order.amount}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${currentStyle}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500 italic">
              No recent orders found.
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Financial Overview</h2>
            <FaWallet className="text-yellow-500" />
          </div>
          <div className="flex flex-col items-center justify-center h-full py-6">
            <div className="bg-gray-900/50 w-full p-8 rounded-2xl border border-gray-700 text-center shadow-inner">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">
                Total Revenue
              </p>
              <p className="text-5xl font-black text-yellow-400 tracking-tighter">
                {formattedRevenue}
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  All-time Earnings
                </p>
              </div>
            </div>
            <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed px-4">
              Net revenue calculated from all fulfilled and processed orders
              across your platform.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
        © {new Date().getFullYear()} Navid Commerce Engine
      </footer>
    </div>
  );
}
