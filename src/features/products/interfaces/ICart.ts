import { ICartItem } from "./ICartItem";

export interface ICart {
  id: number;
  products: ICartItem[];
  total: number;
  totalProducts: number;
  userId: number;
}