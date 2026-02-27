"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";
import { useColors } from "@/hooks/useColors";
import { useSizes } from "@/hooks/useSizes";

import type { ProductVariant } from "@/types/product";
import { InputField, SelectField } from "../add-product/form-ui";

interface VariantAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  existingVariants: ProductVariant[];
}

export default function VariantAddModal({
  isOpen,
  onClose,
  productId,
  existingVariants,
}: VariantAddModalProps) {
  const { updateVariantMutation } = useProducts();
  const { data: colorData } = useColors();
  const { data: sizeData } = useSizes();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      color: "",
      size: "",
      count: "" as any,
      price: "" as any,
      oldPrice: "" as any,
      discount: "" as any,
    },
  });

  const selectedColor = watch("color");
  const selectedSize = watch("size");
  const stockValue = watch("count");
  const priceValue = watch("price");

  const isSubmitting = updateVariantMutation.isPending;
  const isFormIncomplete =
    !selectedColor || !selectedSize || stockValue === "" || priceValue === "";

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const match = existingVariants.find(
        (v) => v.color?.name === selectedColor && v.size?.name === selectedSize,
      );

      if (match) {
        setValue("count", match.count);
        setValue("price", match.price);
        setValue("oldPrice", match.oldPrice ?? "");
        setValue("discount", match.discount ?? "");
      } else {
        setValue("count", "");
        setValue("price", "");
        setValue("oldPrice", "");
        setValue("discount", "");
      }
    }
  }, [selectedColor, selectedSize, existingVariants, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        color: data.color,
        size: data.size,
        count: parseInt(data.count) || 0,
        price: parseFloat(data.price) || 0,
        oldPrice: data.oldPrice === "" ? null : parseFloat(data.oldPrice),
        discount: data.discount === "" ? null : parseFloat(data.discount),
      };

      await updateVariantMutation.mutateAsync({
        productId,
        variantId: 0,
        data: payload,
      });

      toast.success("Variant saved");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save variant");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isSubmitting ? undefined : onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-400">
            Add New Variant
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-4 mt-4 ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Color"
              disabled={isSubmitting}
              options={
                colorData?.data?.map((c: any) => ({
                  value: c.name,
                  label: c.name,
                })) || []
              }
              {...register("color", { required: true })}
              error={errors.color as any}
            />
            <SelectField
              label="Size"
              disabled={isSubmitting}
              options={
                sizeData?.data?.map((s: any) => ({
                  value: s.name,
                  label: s.name,
                })) || []
              }
              {...register("size", { required: true })}
              error={errors.size as any}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Stock"
              type="number"
              disabled={isSubmitting}
              {...register("count", { required: true })}
            />
            <InputField
              label="Price"
              type="number"
              step="0.01"
              disabled={isSubmitting}
              {...register("price", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Old Price"
              type="number"
              step="0.01"
              disabled={isSubmitting}
              {...register("oldPrice")}
            />
            <InputField
              label="Discount %"
              type="number"
              disabled={isSubmitting}
              {...register("discount")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-400"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || isFormIncomplete}
            >
              {isSubmitting ? "Saving..." : "Save Variant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
