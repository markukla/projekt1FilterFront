import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductMiniatureService} from '../productMiniatureService/product-miniature.service';
import Product from '../../../../Products/ProductTypesAndClasses/product.entity';
import {API_URL} from '../../../../Config/apiUrl';
import {OrderBackendService} from '../../OrderServices/order-backend.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';
import LocalizedName from '../../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {getSelectedLanguageFromNamesInAllLanguages} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';

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
    const routeHistoryLastindex: number = this.authenticationService._routeHistory.length - 1;
    const routeHistorySecondLastindex = this.authenticationService._routeHistory.length - 1;
    if (this.authenticationService._routeHistory[routeHistoryLastindex].includes('orders/drawing')) {
      this.router.navigateByUrl(this.authenticationService._routeHistory[routeHistorySecondLastindex]);
    }
    else {
      this.router.navigateByUrl(this.authenticationService._previousUrl);
    }
  }
  getNameInSelectedLanguage(localizedNames: LocalizedName[]): string {
    return getSelectedLanguageFromNamesInAllLanguages(localizedNames, this.authenticationService.selectedLanguageCode);
  }


  makePictureLarger(): void {
  }
}
