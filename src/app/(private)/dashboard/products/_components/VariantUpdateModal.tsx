"use client";

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

import { InputField, SelectField, LoadingSelect } from "./add-product/form-ui";

interface VariantUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  variant: any;
}

export default function VariantUpdateModal({
  isOpen,
  onClose,
  productId,
  variant,
}: VariantUpdateModalProps) {
  const { updateVariantMutation } = useProducts();

  const { data: colorData, isLoading: isLoadingColors } = useColors();
  const { data: sizeData, isLoading: isLoadingSizes } = useSizes();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      color: variant?.color?.name || "",
      size: variant?.size?.name || "",
      count: variant?.count || 0,
      price: variant?.price || 0,
      oldPrice: variant?.oldPrice ?? "",
      discount: variant?.discount ?? "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        color: data.color,
        size: data.size,
        count: Number(data.count),
        price: Number(data.price),
        oldPrice: data.oldPrice === "" ? null : Number(data.oldPrice),
        discount: data.discount === "" ? null : Number(data.discount),
      };

      await updateVariantMutation.mutateAsync({
        productId,
        variantId: variant.id,
        data: payload,
      });

      toast.success("Variant updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update variant");
    }
  };

  const colors = colorData?.data || [];
  const sizes = sizeData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-400">
            Update Variant
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {isLoadingColors ? (
              <LoadingSelect label="Color" />
            ) : colors.length === 0 ? (
              <div className="space-y-2 w-full">
                <label className="text-white font-semibold text-sm">
                  Color
                </label>
                <div className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-500 text-xs italic">
                  None found
                </div>
              </div>
            ) : (
              <SelectField
                label="Color"
                options={colors.map((c: any) => ({
                  value: c.name,
                  label: c.name,
                }))}
                {...register("color", { required: "Color is required" })}
                error={errors.color as any}
              />
            )}

            {isLoadingSizes ? (
              <LoadingSelect label="Size" />
            ) : sizes.length === 0 ? (
              <div className="space-y-2 w-full">
                <label className="text-white font-semibold text-sm">Size</label>
                <div className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-500 text-xs italic">
                  None found
                </div>
              </div>
            ) : (
              <SelectField
                label="Size"
                options={sizes.map((s: any) => ({
                  value: s.name,
                  label: s.name,
                }))}
                {...register("size", { required: "Size is required" })}
                error={errors.size as any}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Stock Count"
              type="number"
              {...register("count", { required: true })}
              error={errors.count as any}
            />
            <InputField
              label="Price ($)"
              type="number"
              step="0.01"
              {...register("price", { required: true })}
              error={errors.price as any}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Old Price"
              type="number"
              step="0.01"
              {...register("oldPrice")}
            />
            <InputField
              label="Discount (%)"
              type="number"
              {...register("discount")}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
              disabled={
                !isDirty ||
                updateVariantMutation.isPending ||
                isLoadingColors ||
                isLoadingSizes
              }
            >
              {updateVariantMutation.isPending
                ? "Saving..."
                : "Confirm Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
