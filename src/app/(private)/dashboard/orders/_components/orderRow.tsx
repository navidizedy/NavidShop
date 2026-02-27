"use client";

import { memo } from "react";
import { OrderStatus } from "@prisma/client";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PREPARING",
  "FULFILLED",
  "SHIPPED",
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "FULFILLED":
      return "bg-green-600";
    case "PREPARING":
      return "bg-blue-600";
    case "PENDING":
      return "bg-yellow-600";
    case "SHIPPED":
      return "bg-purple-600";
    default:
      return "bg-gray-500";
  }
};

interface OrderRowProps {
  order: any;
  isBusy: boolean;
  handleStatusChange: (orderId: number, status: string) => void;
  handleDeleteClick: (order: any) => void;
}

const OrderRow = memo(function OrderRow({
  order,
  isBusy,
  handleStatusChange,
  handleDeleteClick,
}: OrderRowProps) {
  return (
    <div
      className={`bg-gray-800 p-6 rounded-xl shadow-md text-white border border-gray-700 transition-opacity ${
        isBusy ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="font-bold text-xl text-blue-400">Order #{order.id}</p>
            <span
              className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${getStatusColor(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <select
            className="bg-gray-700 text-white text-sm p-2 rounded-lg border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed flex-grow"
            disabled={isBusy}
            value={order.status}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-semibold disabled:opacity-50"
            disabled={isBusy}
            onClick={() => handleDeleteClick(order)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          Customer Details
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="text-sm">
              <span className="text-gray-400 text-xs">Name:</span> {order.name}
            </p>
            <p className="text-sm">
              <span className="text-gray-400 text-xs">Email:</span>{" "}
              {order.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-gray-400 text-xs">Address:</span>{" "}
              {order.address}, {order.city}, {order.zip}, {order.country}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          Items Ordered
        </p>
        {order.items.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl border border-gray-700/50"
          >
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg bg-gray-800"
            />
            <div className="flex-grow">
              <p className="font-semibold text-gray-100">{item.name}</p>
              <div className="flex gap-2 mt-1">
                {item.color && (
                  <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded border border-gray-600 text-gray-300">
                    Color: {item.color}
                  </span>
                )}
                {item.size && (
                  <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded border border-gray-600 text-gray-300">
                    Size: {item.size}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
              <p className="font-bold text-blue-400">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">
            Shipping Method
          </p>
          <p className="text-sm text-gray-300">
            {order.shippingMethod || "Not specified"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold">
            Total Amount
          </p>
          <p className="text-2xl font-black text-yellow-500">
            ${order.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default OrderRow;
