export type Category = {
  id: number;
  name: string;
  imageUrl?: string;
  createdAt?: string;
};

export type AddCategoryResponse = {
  message: string;
  data?: Category;
};

export type UpdateCategoryResponse = {
  message: string;
  data?: Category;
};

export type DeleteCategoryResponse = {
  message: string;
};

export type CategoryListResponse = {
  message?: string;
  data?: Category[];
};
