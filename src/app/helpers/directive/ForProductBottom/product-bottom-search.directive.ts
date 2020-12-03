import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {ProductTopSearchDirective} from '../ForProductTop/product-top-search.directive';
import {ProductTopBackendService} from '../../../Products/ProductTop/ProductTopServices/product-top-backend.service';
import {ProductBottomBackendService} from '../../../Products/ProductBottom/ProductBottomServices/product-bottom-backend.service';

@Directive({
  selector: '[appProductBottomSearch]'
})
export class ProductBottomSearchDirective {

  @Input('appProductBottomSearch') searchedArray: Array<any>;

  orginalArrayCopy: Array<any> = [];

  serchCondition: string;

  // tslint:disable-next-line:max-line-length
  @Input() serchedColumn: string; /* insted of this input i could just declate atribute name in html(it creates completly new Atribute in html) than i can access to its value by target elements object */
  temporatyArray: Array<any> = [];
  allowOrginalArrayCopyChange: boolean;


  constructor(private renderer: Renderer2,
              private targetElement: ElementRef,
              private backendService: ProductBottomBackendService) {
    this.allowOrginalArrayCopyChange = true;
  }
  @HostListener('input')
// tslint:disable-next-line:typedef
  serchTable() {
    this.backendService.getRecords().subscribe((records) => {
      this.orginalArrayCopy = records.body;
      const elem = this.targetElement.nativeElement;

      // tslint:disable-next-line:max-line-length
      /*remember using directives it is better to access element property using target element than doing some extra binding with ng model etc */
      this.serchCondition = elem.value;
      this.temporatyArray.length = 0;
      this.searchedArray.length = 0;
      this.temporatyArray = this.orginalArrayCopy.filter(
        x => x[this.serchedColumn].includes(this.serchCondition)
      );

      // tslint:disable-next-line:max-line-length
      /*when i use filter to serch array it some how does not work, because it is creating new instance of array and directive is bind to previous instance*/
      /*that is why a remove all elements in orginal array and push there temporary array values*/
      this.searchedArray.length = 0;
      this.searchedArray.push(...this.temporatyArray);


      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.searchedArray.length; i++) {
        console.log(this.searchedArray[i]);
      }

    });
  }



}
