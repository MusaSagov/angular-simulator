import { ICartProduct } from "./ICartProduct";

export interface ICartAddPayload {
  userId: number;
  products: ICartProduct[];
}