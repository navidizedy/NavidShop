"use client";

import { useTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { updateCategoryAction } from "@/app/actions/categoryActions";
import {
  categorySchema,
  CategoryFormData,
} from "@/lib/zodSchemas/categorySchema";
import { InputField } from "../../products/_components/add-product/form-ui";

export default function CategoryUpdateModal({
  isOpen,
  onClose,
  category,
}: any) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
  });

  const watchedName = watch("name");
  const watchedImage = watch("image");

  const isNameChanged = watchedName !== category?.name;
  const isImageChanged = watchedImage && watchedImage.length > 0;
  const isFormDirty = isNameChanged || isImageChanged;

  useEffect(() => {
    if (category && isOpen) {
      reset({ name: category.name });
      setPreview(category.imageUrl || "");
    }
  }, [category, reset, isOpen]);

  useEffect(() => {
    if (watchedImage?.[0]) {
      const url = URL.createObjectURL(watchedImage[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedImage]);

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    startTransition(async () => {
      try {
        const res = await updateCategoryAction(category.id, formData);
        if (!res.success) throw new Error(res.message);

        await queryClient.invalidateQueries({ queryKey: ["categories"] });

        toast.success(res.message || "Category updated!");
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <InputField
            label="Category Name"
            {...register("name")}
            error={errors.name}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Category Image
            </label>
            <div className="flex items-center gap-5 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <img
                src={preview || "/placeholder.png"}
                className="w-20 h-20 object-cover rounded-lg border border-gray-600 bg-gray-900"
                alt="preview"
              />
              <div className="flex-1">
                <input
                  type="file"
                  {...register("image")}
                  className="text-xs text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded file:bg-gray-700 file:text-white file:border-0 hover:file:bg-gray-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending || !isFormDirty}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
