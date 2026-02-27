"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { sizeSchema, SizeFormData } from "@/lib/zodSchemas/sizeSchema";
import { addSizeAction } from "@/app/actions/sizeActions";
import SizeUpdateModal from "./SizeUpdateModal";
import SizeDeleteModal from "./SizeDeleteModal";
import SizeRow from "./SizeRow";
import { InputField } from "../../products/_components/add-product/form-ui";
import { Button } from "@/components/ui/button";

export default function AddSizeView({ initialSizes }: { initialSizes: any[] }) {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<"update" | "delete" | null>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema) as any,
  });

  const onSubmit = async (data: SizeFormData) => {
    startTransition(async () => {
      try {
        const res = await addSizeAction(data.name);
        if (!res.success) throw new Error(res.message);

        await queryClient.invalidateQueries({ queryKey: ["sizes"] });

        toast.success(res.message || "Size added!");
        reset();
      } catch (err: any) {
        toast.error(err.message || "Failed to add size");
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Toaster />
      <SizeUpdateModal
        isOpen={modal === "update"}
        onClose={() => setModal(null)}
        size={selectedSize}
      />
      <SizeDeleteModal
        isOpen={modal === "delete"}
        onClose={() => setModal(null)}
        size={selectedSize}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Manage Sizes</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-10 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <InputField
                label="New Size"
                placeholder="e.g. XL, 44"
                {...register("name")}
                error={errors.name}
              />
            </div>
            <Button
              disabled={isPending}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-[42px] px-10"
            >
              {isPending ? "Adding..." : "Add Size"}
            </Button>
          </div>
        </form>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">
                  ID
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">
                  Size Label
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {initialSizes.map((s) => (
                <SizeRow
                  key={s.id}
                  size={s}
                  onEdit={() => {
                    setSelectedSize(s);
                    setModal("update");
                  }}
                  onDelete={() => {
                    setSelectedSize(s);
                    setModal("delete");
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
