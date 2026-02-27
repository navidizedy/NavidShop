export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  variant: {
    id: number;
    price: number;
    product: {
      id: number;
      name: string;
      images: { url: string }[];
    };
    color?: { name: string };
    size?: { name: string };
  };
}
