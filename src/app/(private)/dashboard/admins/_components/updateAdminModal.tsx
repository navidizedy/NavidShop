"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  updateAdminSchema,
  UpdateAdminFormData,
} from "@/lib/zodSchemas/adminSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateAdminAction } from "@/app/actions/adminActions";
import { InputField } from "../../products/_components/add-product/form-ui";

export default function UpdateAdminModal({ isOpen, onClose, admin }: any) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateAdminFormData>({
    resolver: zodResolver(updateAdminSchema) as any,
  });

  useEffect(() => {
    if (admin && isOpen) {
      reset({ name: admin.name, email: admin.email, password: "" });
    }
  }, [admin, reset, isOpen]);

  const watched = watch();
  const isUnchanged =
    watched.name === admin?.name &&
    watched.email === admin?.email &&
    (!watched.password || watched.password === "");

  const onSubmit = async (data: UpdateAdminFormData) => {
    startTransition(async () => {
      try {
        const res = await updateAdminAction(admin.id, data);
        if (!res.success) throw new Error(res.message);
        toast.success("Admin profile updated");
        onClose();
      } catch (error: any) {
        toast.error(error.message || "Failed to update");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Modify Admin Permissions</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <InputField label="Name" {...register("name")} error={errors.name} />
          <InputField
            label="Email Address"
            {...register("email")}
            error={errors.email}
          />

          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <InputField
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current"
              {...register("password")}
              error={errors.password}
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
              disabled={isPending || isUnchanged}
              className="bg-blue-600 px-8"
            >
              {isPending ? "Applying..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
