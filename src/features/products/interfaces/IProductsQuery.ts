import { ProductSortField, SortOrder } from "../product-api.service";

export interface IProductsQuery {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
  sortBy?: ProductSortField;
  order?: SortOrder;
}