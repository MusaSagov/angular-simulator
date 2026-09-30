import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProductApiService } from './product-api.service';
import { IProduct } from './interfaces/IProduct';

export const productResolver: ResolveFn<IProduct> = (route) => {
  const api: ProductApiService = inject(ProductApiService);
  const id: number = Number(route.paramMap.get('id'));
  return api.getProductById(id);
};