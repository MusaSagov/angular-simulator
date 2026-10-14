import { ICartProduct } from "./ICartProduct";

export interface ICartUpdatePayload {
  merge?: boolean;
  products: ICartProduct[];
}