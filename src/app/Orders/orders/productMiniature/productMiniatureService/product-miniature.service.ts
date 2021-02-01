import { Injectable } from '@angular/core';
import Product from '../../../../Products/ProductTypesAndClasses/product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductMiniatureService {
  allProducts: Product[];
  selectedProduct: Product;
  constructor() {
  }
}
