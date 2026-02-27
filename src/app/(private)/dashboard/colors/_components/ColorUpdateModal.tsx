"use client";

import { useTransition, useEffect } from "react";
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
import { toast } from "react-hot-toast";
import { colorSchema, ColorFormData } from "@/lib/zodSchemas/colorSchema";
import { updateColorAction } from "@/app/actions/colorActions";
import { InputField } from "../../products/_components/add-product/form-ui";

export default function ColorUpdateModal({ isOpen, onClose, color }: any) {
  const queryClient = useQueryClient();
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

  useEffect(() => {
    if (color && isOpen) reset({ name: color.name });
  }, [color, reset, isOpen]);

  const onSubmit = async (data: ColorFormData) => {
    if (!color) return;
    startTransition(async () => {
      try {
        const res = await updateColorAction(color.id, data.name);
        if (!res.success) throw new Error(res.message);

        await queryClient.invalidateQueries({ queryKey: ["colors"] });

        toast.success("Color updated successfully");
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Failed to update");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Color</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="relative">
            <InputField
              label="Color Name / Hex"
              {...register("name")}
              error={errors.name}
            />
            <div
              className="absolute right-3 top-[38px] w-5 h-5 rounded-full border border-gray-600 shadow-inner"
              style={{ backgroundColor: watchedName || "transparent" }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-400"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || watchedName === color?.name}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
