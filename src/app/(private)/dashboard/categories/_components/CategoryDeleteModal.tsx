"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { deleteCategoryAction } from "@/app/actions/categoryActions";

interface CategoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: number; name: string } | null;
}

export default function CategoryDeleteModal({
  isOpen,
  onClose,
  category,
}: CategoryDeleteModalProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!category) return;

    startTransition(async () => {
      try {
        const res = await deleteCategoryAction(category.id);

        await queryClient.invalidateQueries({ queryKey: ["categories"] });

        toast.success(res.message);
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete category");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-bold text-red-400">{category?.name}</span>?
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="bg-gray-700 hover:bg-gray-600"
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
