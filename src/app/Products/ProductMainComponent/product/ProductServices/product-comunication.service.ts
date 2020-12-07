import { Injectable } from '@angular/core';
import ProductType from '../../../ProductTypesAndClasses/productType.entity';
import ProductBottom from '../../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../ProductTypesAndClasses/productTop.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductComunicationService {
  selectedType: ProductType;
  selectedBottom: ProductBottom;
  selectedTop: ProductTop;
  constructor() { }
}
