import { Category } from "./category";
import { Color } from "./color";
import { Size } from "./size";

export type ProductImage = {
  id: number;
  url: string;
  productId: number;
  createdAt: string;
};

export type ProductVariant = {
  id: number;
  count: number;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  productId: number;
  colorId?: number | null;
  sizeId?: number | null;
  createdAt: string;
  updatedAt: string;
  color?: Color | null;
  size?: Size | null;
};

export type ProductCategory = {
  productId: number;
  categoryId: number;
  category: Category;
};

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  details?: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId?: number | null;

  images: ProductImage[];
  variants: ProductVariant[];
  categories: ProductCategory[];
};

export type ProductInput = {
  name: string;
  description?: string;
  images: (string | File)[];
  categories?: string[];
  variants: {
    size?: string;
    color?: string;
    count: number;
    price: number;
    oldPrice?: number;
    discount?: number;
  }[];
};
