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
import { deleteSizeAction } from "@/app/actions/sizeActions";

export default function SizeDeleteModal({ isOpen, onClose, size }: any) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSizeAction(size.id);

        await queryClient.invalidateQueries({ queryKey: ["sizes"] });

        toast.success("Size deleted");
        onClose();
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Size</DialogTitle>
        </DialogHeader>
        <p className="text-gray-400">
          Delete <span className="text-red-400 font-bold">{size?.name}</span>?
        </p>
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
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
