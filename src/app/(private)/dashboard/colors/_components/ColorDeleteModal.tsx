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
import { toast } from "react-hot-toast";
import { deleteColorAction } from "@/app/actions/colorActions";

export default function ColorDeleteModal({ isOpen, onClose, color }: any) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!color) return;
    startTransition(async () => {
      try {
        await deleteColorAction(color.id);

        await queryClient.invalidateQueries({ queryKey: ["colors"] });

        toast.success("Color deleted");
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Color</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Are you sure you want to delete{" "}
          <span className="text-red-400 font-bold">{color?.name}</span>?
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="secondary" className="bg-gray-700">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
