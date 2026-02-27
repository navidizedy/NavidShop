export * from "./category";
export * from "./color";
export * from "./size";
export * from "./product";
export * from "./user";
export * from "./cart";
export interface ProductListResponse {
  data: Array<any>;
  message?: string;
}
