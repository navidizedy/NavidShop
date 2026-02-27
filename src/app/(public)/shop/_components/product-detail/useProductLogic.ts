import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCarts } from "@/hooks/useCarts";
import { Product } from "./types";
import { toast } from "react-hot-toast";

interface UseProductLogicProps {
  product: Product;
  session: any;
}

export const useProductLogic = ({ product, session }: UseProductLogicProps) => {
  const router = useRouter();
  const userId = session?.id ? Number(session.id) : undefined;
  const { addToCartMutation } = useCarts(userId);

  const hasAnyStock = useMemo(
    () => product.variants.some((v) => v.count > 0),
    [product],
  );

  const initialVariant = useMemo(() => {
    return product._meta.lowestVariant;
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    initialVariant?.size?.name ?? null,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialVariant?.color?.name ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const allPossibleColors = useMemo(
    () =>
      [...new Set(product.variants.map((v) => v.color?.name))].filter(
        Boolean,
      ) as string[],
    [product],
  );

  const allPossibleSizes = useMemo(
    () =>
      [...new Set(product.variants.map((v) => v.size?.name))].filter(
        Boolean,
      ) as string[],
    [product],
  );

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return (
      product.variants.find(
        (v) => v.color?.name === selectedColor && v.size?.name === selectedSize,
      ) || null
    );
  }, [product, selectedColor, selectedSize]);

  return {
    state: {
      selectedSize,
      selectedColor,
      selectedVariant,
      allPossibleColors,
      allPossibleSizes,
      quantity,
      activeImage,
      activeTab,
      images: product.images.map((i) => i.url),
      isAddingToCart: addToCartMutation.isPending,
      hasAnyStock,
    },
    actions: {
      handleSelectColor: (colorName: string) => {
        setSelectedColor(colorName);

        const variantsOfColor = product.variants.filter(
          (v) => v.color?.name === colorName,
        );
        const bestInColor = variantsOfColor.sort((a, b) => {
          const aInStock = a.count > 0;
          const bInStock = b.count > 0;
          if (aInStock !== bInStock) return aInStock ? -1 : 1;
          return a.price - b.price;
        })[0];

        if (bestInColor?.size?.name) {
          setSelectedSize(bestInColor.size.name);
        }
        setQuantity(1);
      },
      handleSelectSize: (size: string) => {
        setSelectedSize(size);
        setQuantity(1);
      },
      setQuantity,
      setActiveImage,
      setActiveTab,
      handleAddToCart: () => {
        if (!session) {
          toast.error("Please login to add items to cart");
          return router.push("/login");
        }
        if (!selectedVariant || selectedVariant.count <= 0) return;

        addToCartMutation.mutate(
          { variantId: selectedVariant.id, quantity },
          {
            onSuccess: () => {
              toast.success(`${product.name} added to cart!`);
            },
            onError: () => {
              toast.error("Failed to add item to cart. Please try again.");
            },
          },
        );
      },
    },
  };
};
