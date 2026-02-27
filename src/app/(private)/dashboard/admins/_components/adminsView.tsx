"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema, AdminFormData } from "@/lib/zodSchemas/adminSchema";
import { toast, Toaster } from "react-hot-toast";
import { addAdminAction } from "@/app/actions/adminActions";
import { InputField } from "../../products/_components/add-product/form-ui";
import { Button } from "@/components/ui/button";
import UpdateAdminModal from "./updateAdminModal";
import DeleteAdminModal from "./deleteAdminModal";

export default function AdminsView({
  initialAdmins,
  mainAdminEmail,
  currentUserId,
}: {
  initialAdmins: any[];
  mainAdminEmail: string;
  currentUserId: string | number;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [modals, setModals] = useState({ update: false, delete: false });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema) as any,
  });

  const onSubmit = async (data: AdminFormData) => {
    startTransition(async () => {
      try {
        const res = await addAdminAction(data);
        if (!res.success) throw new Error(res.message);
        toast.success(res.message || "Admin created successfully");
        reset();
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Toaster />

      {selectedAdmin && (
        <>
          <UpdateAdminModal
            isOpen={modals.update}
            admin={selectedAdmin}
            onClose={() => setModals({ ...modals, update: false })}
          />
          <DeleteAdminModal
            isOpen={modals.delete}
            adminId={selectedAdmin.id}
            onClose={() => setModals({ ...modals, delete: false })}
          />
        </>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-gray-400 text-sm mt-2">
            Create and manage administrative accounts.
          </p>
        </header>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-10">
          <h2 className="text-lg font-semibold mb-6 text-blue-400">
            Add New Admin
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <InputField
              label="Name"
              placeholder="Full Name"
              {...register("name")}
              error={errors.name}
            />
            <InputField
              label="Email"
              placeholder="admin@example.com"
              {...register("email")}
              error={errors.email}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password}
            />
            <Button
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 h-[42px] font-bold w-full"
            >
              {isPending ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="p-4 text-xs uppercase font-bold text-gray-400 tracking-widest w-24">
                    ID
                  </th>
                  <th className="p-4 text-xs uppercase font-bold text-gray-400 tracking-widest">
                    User Details
                  </th>
                  <th className="p-4 text-xs uppercase font-bold text-gray-400 tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {initialAdmins.map((admin) => {
                  const isMain =
                    admin.email.toLowerCase() === mainAdminEmail.toLowerCase();
                  const isCurrentUser =
                    String(admin.id) === String(currentUserId);

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-700/30 transition-colors group"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-gray-500 font-mono text-xs bg-gray-900/50 px-2 py-1 rounded border border-gray-700">
                          #{admin.id.toString().slice(-4)}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-100 flex items-center gap-2">
                            {admin.name}
                            {isCurrentUser && (
                              <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20 uppercase font-bold">
                                You
                              </span>
                            )}
                            {isMain && (
                              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-bold">
                                Owner
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-gray-500">
                            {admin.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {!isMain ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setModals({ ...modals, update: true });
                              }}
                              className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 font-bold text-xs"
                            >
                              Edit
                            </Button>
                            {!isCurrentUser && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedAdmin(admin);
                                  setModals({ ...modals, delete: true });
                                }}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold text-xs"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-600 font-mono italic px-3 tracking-tighter uppercase">
                            Protected Account
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
