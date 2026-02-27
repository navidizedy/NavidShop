"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { colorSchema, ColorFormData } from "@/lib/zodSchemas/colorSchema";
import { addColorAction } from "@/app/actions/colorActions";
import { InputField } from "../../products/_components/add-product/form-ui";
import { Button } from "@/components/ui/button";
import ColorRow from "./ColorRow";
import ColorDeleteModal from "./ColorDeleteModal";
import ColorUpdateModal from "./ColorUpdateModal";

export default function AddColorView({
  initialColors,
}: {
  initialColors: any[];
}) {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<"update" | "delete" | null>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema) as any,
  });

  const watchedName = watch("name");

  const onSubmit = async (data: ColorFormData) => {
    startTransition(async () => {
      try {
        const res = await addColorAction(data.name);
        if (!res.success) throw new Error(res.message);

        await queryClient.invalidateQueries({ queryKey: ["colors"] });

        toast.success(res.message || "Color added!");
        reset();
      } catch (err: any) {
        toast.error(err.message || "Failed to add color");
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Toaster />
      <ColorUpdateModal
        isOpen={modal === "update"}
        onClose={() => setModal(null)}
        color={selectedColor}
      />
      <ColorDeleteModal
        isOpen={modal === "delete"}
        onClose={() => setModal(null)}
        color={selectedColor}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Colors</h1>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-10">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">
            Add New Color
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row items-end gap-4"
          >
            <div className="flex-1 w-full relative">
              <InputField
                label="New Color"
                placeholder="e.g. Royal Blue"
                {...register("name")}
                error={errors.name}
              />
              <div
                className="absolute right-3 top-[38px] w-5 h-5 rounded-full border border-gray-600 shadow-inner"
                style={{ backgroundColor: watchedName || "transparent" }}
              />
            </div>
            <Button
              disabled={isPending}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-[42px] px-10"
            >
              {isPending ? "Adding..." : "Add Color"}
            </Button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">
                  Id
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">
                  Preview
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">
                  Color Name
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {initialColors.map((color) => (
                <ColorRow
                  key={color.id}
                  color={color}
                  onEdit={() => {
                    setSelectedColor(color);
                    setModal("update");
                  }}
                  onDelete={() => {
                    setSelectedColor(color);
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
