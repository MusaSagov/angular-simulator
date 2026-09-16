export interface ICartAddPayload {
  userId: number;
  products: { id: number; quantity: number }[];
}