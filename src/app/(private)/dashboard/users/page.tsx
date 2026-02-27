"use client";

import React, { useState, useEffect } from "react";
import { getAllUsers } from "@/app/actions/getUsers";
import { FaShoppingBag } from "react-icons/fa";
import Pagination from "@/components/Pagination";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllUsers(currentPage, pageSize);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <div className="mt-2 h-5 flex items-center">
          {loading && totalPages === 0 ? (
            <div className="h-4 w-48 bg-gray-800 animate-pulse rounded" />
          ) : (
            <p className="text-gray-400 text-sm">
              Viewing page{" "}
              <span className="text-white font-medium">{currentPage}</span> of{" "}
              <span className="text-white font-medium">{totalPages || 1}</span>
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-700">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-center">Total Spent</th>
                <th className="px-6 py-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                [...Array(pageSize)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5">
                      <div className="h-4 w-4 bg-gray-700 rounded" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
                      <div className="h-3 w-48 bg-gray-700/50 rounded" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="h-6 w-12 bg-gray-700 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="h-4 w-16 bg-gray-700 rounded mx-auto" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="h-4 w-24 bg-gray-700 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                      {(currentPage - 1) * pageSize + (index + 1)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                        <FaShoppingBag size={10} />
                        {user.orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-green-400 font-bold text-sm">
                        ${user.totalSpent.toFixed(0)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500 font-medium">
                      {user.joinedAt}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-20 text-gray-500 italic"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="dark"
          />
        </div>
      )}
    </div>
  );
}
