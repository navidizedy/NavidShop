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
import { updateSizeAction } from "@/app/actions/sizeActions";
import { sizeSchema, SizeFormData } from "@/lib/zodSchemas/sizeSchema";
import { InputField } from "../../products/_components/add-product/form-ui";

export default function SizeUpdateModal({ isOpen, onClose, size }: any) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema) as any,
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (size && isOpen) reset({ name: size.name });
  }, [size, reset, isOpen]);

  const onSubmit = (data: SizeFormData) => {
    startTransition(async () => {
      try {
        const res = await updateSizeAction(size.id, data.name);
        if (!res.success) throw new Error(res.message);

        await queryClient.invalidateQueries({ queryKey: ["sizes"] });

        toast.success("Size updated successfully");
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Update failed");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Update Size</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <InputField
            label="Size Label"
            {...register("name")}
            error={errors.name}
          />
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
              disabled={isPending || watchedName === size?.name}
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
