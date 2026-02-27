"use client";

import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useProducts } from "@/hooks/useProducts";

interface VariantDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  variantId: number;
}

export default function VariantDeleteModal({
  isOpen,
  onClose,
  productId,
  variantId,
}: VariantDeleteModalProps) {
  const { deleteVariantMutation } = useProducts();

  const handleDelete = useCallback(async () => {
    try {
      await deleteVariantMutation.mutateAsync({ productId, variantId });
      toast.success("Variant deleted successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete variant");
    }
  }, [productId, variantId, deleteVariantMutation, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Variant</DialogTitle>
        </DialogHeader>

        <p className="mt-4 text-white">
          Are you sure you want to delete this variant? This action cannot be
          undone.
        </p>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={deleteVariantMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteVariantMutation.isPending}
          >
            {deleteVariantMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
