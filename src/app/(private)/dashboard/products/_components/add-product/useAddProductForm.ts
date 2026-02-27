import { useState, useEffect } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";
import { useColors } from "@/hooks/useColors";
import { useSizes } from "@/hooks/useSizes";
import { useProducts } from "@/hooks/useProducts";
import {
  AddProductFormData,
  addProductSchema,
} from "@/lib/zodSchemas/addProductSchema";

export const useAddProductForm = () => {
  const { data: catData, isLoading: catLoading } = useCategories();
  const { data: colorData, isLoading: colorLoading } = useColors();
  const { data: sizeData, isLoading: sizeLoading } = useSizes();
  const { addProductMutation } = useProducts();

  const formMethods = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      details: "",
      categories: [],
      variants: [{ color: "", size: "", count: 1, price: 0 }],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = formMethods;
  const variantFields = useFieldArray({ control, name: "variants" });

  const watchedImages = watch("images");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const files =
      watchedImages instanceof FileList ? Array.from(watchedImages) : [];
    if (files.length) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
    setImagePreviews([]);
  }, [watchedImages]);

  const onSubmit = handleSubmit(async (formData: AddProductFormData) => {
    try {
      const images =
        formData.images instanceof FileList ? Array.from(formData.images) : [];

      const payload = {
        name: formData.name,
        description: formData.description,
        details: formData.details,
        categories: formData.categories,
        images,
        variants: formData.variants.map((v) => ({
          color: v.color,
          size: v.size,
          count: Number(v.count),
          price: Number(v.price),
          oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined,
          discount: v.discount ? Number(v.discount) : undefined,
        })),
      };

      const res = await addProductMutation.mutateAsync(payload as any);
      toast.success(res.message);
      reset();
      setImagePreviews([]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add product");
    }
  });

  return {
    formMethods,
    variantFields,
    data: {
      categories: catData?.data ?? [],
      colors: colorData?.data ?? [],
      sizes: sizeData?.data ?? [],
    },
    loading: {
      loadingSelects: catLoading || colorLoading || sizeLoading,
      isSubmitting,
    },
    images: { imagePreviews },
    onSubmit,
  };
};
