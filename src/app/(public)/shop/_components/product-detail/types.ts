export type ProductVariant = {
  id: number;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  count: number;
  color?: { name: string } | null;
  size?: { name: string } | null;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  details: string | null;
  images: { url: string }[];
  variants: ProductVariant[];
  _meta: {
    lowest: number;
    lowestVariant: ProductVariant;
  };
};

export type RelatedProduct = {
  id: number;
  name: string;
  images: { url: string }[];
  variants: {
    price: number;
    oldPrice: number | null;
    discount: number | null;
    count: number;
  }[];
};
