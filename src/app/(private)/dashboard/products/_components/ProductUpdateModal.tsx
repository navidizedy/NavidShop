"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { Product } from "@/types";
import {
  updateProductSchema,
  UpdateProductFormData,
} from "@/lib/zodSchemas/updateProductSchema";

import {
  InputField,
  TextAreaField,
  SelectField,
  LoadingSelect,
} from "./add-product/form-ui";

interface ProductUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductUpdateModal({
  isOpen,
  onClose,
  product,
}: ProductUpdateModalProps) {
  const { updateProductMutation } = useProducts();

  const { data: catData, isLoading: isCatsLoading } = useCategories();

  const categoriesOptions = useMemo(
    () => catData?.data?.map((c) => ({ value: c.name, label: c.name })) ?? [],
    [catData],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen && product) {
      reset({
        name: product.name || "",
        description: product.description || "",
        details: product.details || "",
        categories:
          product.categories
            ?.map((c: any) => c.category?.name)
            .filter(Boolean) || [],
      });
      setExistingImages(
        product.images?.map((img) => img.url).filter(Boolean) || [],
      );
      setSelectedFiles([]);
    }
  }, [isOpen, product, reset]);

  const selectedFilePreviews = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
    [selectedFiles],
  );

  useEffect(() => {
    return () =>
      selectedFilePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFilePreviews]);

  const watchedValues = watch();

  const isChanged = useMemo(() => {
    const originalCats =
      product.categories?.map((c: any) => c.category?.name).filter(Boolean) ||
      [];
    const catsChanged =
      JSON.stringify(watchedValues.categories?.sort()) !==
      JSON.stringify(originalCats.sort());
    const imagesChanged =
      selectedFiles.length > 0 ||
      existingImages.length !== (product.images?.length || 0);

    return (
      watchedValues.name !== product.name ||
      watchedValues.description !== product.description ||
      watchedValues.details !== (product.details || "") ||
      catsChanged ||
      imagesChanged
    );
  }, [watchedValues, selectedFiles, existingImages, product]);

  const onSubmit = async (data: UpdateProductFormData) => {
    if (existingImages.length === 0 && selectedFiles.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("details", data.details || "");
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("existingImages", JSON.stringify(existingImages));
      selectedFiles.forEach((file) => formData.append("newImages", file));

      await updateProductMutation.mutateAsync({
        id: product.id,
        data: formData,
      });

      toast.success("Product updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Update failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Update Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              {...register("name")}
              error={errors.name}
            />

            {isCatsLoading ? (
              <LoadingSelect label="Categories" />
            ) : categoriesOptions.length === 0 ? (
              <div className="space-y-2 w-full">
                <label className="text-white font-semibold text-sm">
                  Categories
                </label>
                <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 text-sm italic">
                  No categories found.
                </div>
              </div>
            ) : (
              <SelectField
                label="Categories"
                multiple
                options={categoriesOptions}
                {...register("categories")}
                error={errors.categories}
              />
            )}
          </div>

          <InputField
            label="Brief Description"
            {...register("description")}
            error={errors.description}
          />

          <TextAreaField
            label="Full Details / Specs"
            rows={4}
            {...register("details")}
            error={errors.details}
          />

          <div className="space-y-3">
            <label className="text-white font-semibold text-sm">
              Product Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                e.target.files && setSelectedFiles(Array.from(e.target.files))
              }
              className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            <div className="flex gap-3 flex-wrap mt-2">
              {selectedFiles.map((file, idx) => (
                <div key={`new-${idx}`} className="relative group">
                  <img
                    src={selectedFilePreviews[idx]}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-blue-500"
                    alt="new"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ))}

              {existingImages.map((url, idx) => (
                <div key={`old-${idx}`} className="relative group">
                  <img
                    src={url}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600 opacity-80 group-hover:opacity-100"
                    alt="existing"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImages((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              disabled={!isChanged || updateProductMutation.isPending}
            >
              {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
