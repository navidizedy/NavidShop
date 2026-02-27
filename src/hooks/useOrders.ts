import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  placeOrder,
  getUserOrders,
  PlaceOrderPayload,
  Order,
} from "@/services/order";
import { toast } from "react-hot-toast";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, PlaceOrderPayload>({
    mutationFn: async (payload: PlaceOrderPayload) => {
      const order = await placeOrder(payload);
      if (!order) throw new Error("Failed to create order");
      return order;
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to place order");
    },
  });

  return mutation;
};

export const useUserOrders = (page: number = 1) => {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => getUserOrders(page),
    refetchOnWindowFocus: false,
  });
};
