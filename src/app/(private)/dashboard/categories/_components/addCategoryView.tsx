"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  categorySchema,
  CategoryFormData,
} from "@/lib/zodSchemas/categorySchema";
import { addCategoryAction } from "@/app/actions/categoryActions";
import CategoryUpdateModal from "./CategoryUpdateModal";
import CategoryDeleteModal from "./CategoryDeleteModal";
import CategoryRow from "./CategoryRow";
import { InputField } from "../../products/_components/add-product/form-ui";
import { Button } from "@/components/ui/button";

export default function AddCategoryView({
  initialCategories,
}: {
  initialCategories: any[];
}) {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<"update" | "delete" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
  });

  const onSubmit = async (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    startTransition(async () => {
      try {
        const res = await addCategoryAction(formData);

        if (!res.success) {
          throw new Error(res.message);
        }

        await queryClient.invalidateQueries({ queryKey: ["categories"] });

        toast.success(res.message || "Category added successfully!");
        reset();
      } catch (err: any) {
        toast.error(err.message || "Failed to add category");
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <Toaster />

      <CategoryUpdateModal
        isOpen={modal === "update"}
        onClose={() => setModal(null)}
        category={selectedCategory}
      />

      <CategoryDeleteModal
        isOpen={modal === "delete"}
        onClose={() => setModal(null)}
        category={selectedCategory}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Categories</h1>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-10">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">
            Add New Category
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row items-end gap-4"
          >
            <div className="flex-1 w-full">
              <InputField
                label="Category Name"
                placeholder="e.g. Running Shoes"
                {...register("name")}
                error={errors.name}
              />
            </div>

            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Image (Optional)
              </label>
              <input
                type="file"
                {...register("image")}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-blue-700 cursor-pointer"
              />
            </div>

            <Button
              disabled={isPending}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-[42px] px-8"
            >
              {isPending ? "Adding..." : "Create Category"}
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
                  Image
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest">
                  Name
                </th>
                <th className="p-4 text-gray-400 text-xs uppercase font-bold tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {initialCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-gray-500 italic"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                initialCategories.map((cat) => (
                  <CategoryRow
                    key={cat.id}
                    category={cat}
                    onEdit={() => {
                      setSelectedCategory(cat);
                      setModal("update");
                    }}
                    onDelete={() => {
                      setSelectedCategory(cat);
                      setModal("delete");
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
