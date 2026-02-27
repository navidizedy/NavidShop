import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "@/services/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCarts(userId?: number) {
  const queryClient = useQueryClient();

  const getCartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: getCart,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const addToCartMutation = useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: number;
      quantity: number;
    }) => addToCart(variantId, quantity),
    onSuccess: invalidateCart,
  });

  const updateCartItemMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: invalidateCart,
  });

  const deleteCartItemMutation = useMutation({
    mutationFn: (id: number) => deleteCartItem(id),
    onSuccess: invalidateCart,
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: invalidateCart,
  });

  return {
    ...getCartQuery,
    addToCartMutation,
    updateCartItemMutation,
    deleteCartItemMutation,
    clearCartMutation,
  };
}
