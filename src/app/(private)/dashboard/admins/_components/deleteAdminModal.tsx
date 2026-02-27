"use client";

import { useTransition } from "react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteAdminAction } from "@/app/actions/adminActions";

interface DeleteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: number | null;
}

export default function DeleteAdminModal({
  isOpen,
  onClose,
  adminId,
}: DeleteAdminModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!adminId) return;

    startTransition(async () => {
      try {
        const res = await deleteAdminAction(adminId);
        toast.success(res.message);
        onClose();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete admin");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-red-400">Delete Admin</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-gray-300">
          Are you sure you want to delete this admin? This action is
          <span className="text-red-400 font-bold"> permanent </span>
          and cannot be undone.
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
