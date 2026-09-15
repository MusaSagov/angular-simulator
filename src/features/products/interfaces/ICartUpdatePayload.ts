export interface ICartUpdatePayload {
  merge?: boolean;
  products: { id: number; quantity: number }[];
}