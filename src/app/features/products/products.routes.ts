import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { productResolver } from './product.resolver';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', component: ProductsComponent },
  {
    path: ':id',
    component: ProductDetailComponent,
    resolve: { product: productResolver }
  }
];