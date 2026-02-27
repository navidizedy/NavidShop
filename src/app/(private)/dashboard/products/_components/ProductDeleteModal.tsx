"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "react-hot-toast";

interface ProductDeleteModalProps {
  isOpen: boolean;
  productName?: string;
  productId: number | null;
  onClose: () => void;
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  productName,
  onClose,
  productId,
}) => {
  const { deleteProductMutation } = useProducts();

  const handleDelete = useCallback(async () => {
    if (!productId) return;
    try {
      const res = await deleteProductMutation.mutateAsync(productId);
      toast.success(res.message);
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    }
  }, [productId, deleteProductMutation, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>

        <p className="mt-4 text-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-400">{productName}</span>?
          This action cannot be undone.
        </p>

        <DialogFooter className="mt-6 flex justify-end space-x-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="bg-gray-700 hover:bg-gray-600 text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDeleteModal;
