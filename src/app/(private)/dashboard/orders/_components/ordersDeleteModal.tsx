"use client";
import { useTransition } from "react";
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
import { deleteOrderAction } from "@/app/actions/orderActions";

export default function OrdersDeleteModal({ isOpen, orderId, onClose }: any) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteOrderAction(orderId);
        toast.success("Order deleted");
        onClose();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Order #{orderId}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-400">
          Are you sure? This will permanently remove this order from your
          records.
        </p>
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
            disabled={isPending}
            onClick={handleDelete}
            variant="destructive"
            className="bg-red-600"
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
