import { IQuote } from "./IQuote";

export interface IQuotesResponse {
  quotes: IQuote[];
  total: number;
  skip: number;
  limit: number;
}