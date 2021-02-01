import { Component, OnInit } from '@angular/core';
import {ProductMiniatureService} from '../productMiniatureService/product-miniature.service';
import Product from '../../../../Products/ProductTypesAndClasses/product.entity';
import {API_URL} from '../../../../Config/apiUrl';
import {OrderBackendService} from '../../OrderServices/order-backend.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';

@Component({
  selector: 'app-procut-miniature-component',
  templateUrl: './procut-miniature-component.component.html',
  styleUrls: ['./procut-miniature-component.component.css']
})
export class ProcutMiniatureComponentComponent implements OnInit {
  products: Product[];
  selectedProduct: Product;

  constructor(
    private productMiniatureService: ProductMiniatureService,
    private orderBackendService: OrderBackendService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.products = this.productMiniatureService.allProducts;
  }
  getDrawingUrl(product: Product): string  {
    const url = API_URL + product.urlOfOrginalDrawing;
    return url;
  }

  selectProductAndNavigateBack(product: Product): void {
    this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing.product = product;
    this.productMiniatureService.selectedProduct = product;
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }
}
