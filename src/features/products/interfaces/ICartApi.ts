import { ICartItemApi } from "./ICartItemApi";

export interface ICartApi {
  id: number;
  products: ICartItemApi[];
  total: number;
  totalProducts: number;
  userId: number;
}