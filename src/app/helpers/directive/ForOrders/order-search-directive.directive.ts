import {AfterContentChecked, Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {OrderBackendService} from '../../../Orders/orders/OrderServices/order-backend.service';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import RoleEnum from '../../../Users/users/userTypes/roleEnum';
import {OrderTableService} from '../../../Orders/orders/OrderServices/order-table.service';
import {ActivatedRoute} from '@angular/router';
import {BusinesPartnerBackendService} from '../../../BusinessPartners/business-partners/BusinessPartnerServices/busines-partner-backend.service';
import Order from '../../../Orders/OrdersTypesAndClasses/orderEntity';
import OrderforTableCell from '../../../Orders/OrdersTypesAndClasses/orderforTableCell';

@Directive({
  selector: '[appOrderSearchDirective]'
})
export class OrderSearchDirectiveDirective implements OnInit, AfterContentChecked {

  @Input('appOrderSearchDirective') searchedArray: Array<any>;

  orginalArrayCopy: Array<any> = [];

  serchCondition: string;

  // tslint:disable-next-line:max-line-length
  @Input() serchedColumn: string; /* insted of this input i could just declate atribute name in html(it creates completly new Atribute in html) than i can access to its value by target elements object */
  /* @Input() searchedProperty: any; */
  temporatyArray: Array<any> = [];
  allowOrginalArrayCopyChange: boolean;
  partnerIdForOrdersShow: string;


  constructor(private renderer: Renderer2,
              private targetElement: ElementRef,
              private backendService: OrderBackendService,
              private partnerBackendService: BusinesPartnerBackendService,
              private tableService: OrderTableService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute
  ) {
    this.allowOrginalArrayCopyChange = true;
  }

  @HostListener('input')
// tslint:disable-next-line:typedef
  async serchTable() {

    const elem = this.targetElement.nativeElement;
    if (this.partnerIdForOrdersShow) {
  const foundParnter = await this.partnerBackendService.findRecordById(this.partnerIdForOrdersShow).toPromise();
  this.orginalArrayCopy = this.createOrdersForTableCellFromOrders(foundParnter.body.ordersOfPartner) ;
}
 else if (this.authenticationService.userRole === RoleEnum.PARTNER) {
   const foundOrders = await this.backendService.getCurrentOrdersForPartners(this.authenticationService.user.code).toPromise();
   this.orginalArrayCopy = this.createOrdersForTableCellFromOrders(foundOrders.body);
 }
 else {
      const foundOrders = await  this.backendService.getCurrentOrdersForPrivilligedUsers().toPromise();
      this.orginalArrayCopy = this.createOrdersForTableCellFromOrders(foundOrders.body);
    }
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
  }

  ngOnInit(): void {
     this.route.queryParamMap.subscribe(queryParams => {
      this.partnerIdForOrdersShow = queryParams.get('patnerId');
    });
    // this.setOrginalArrayCopy();
  }
  setOrginalArrayCopy(): void {
    this.orginalArrayCopy.length = 0;
    if (this.authenticationService.userRole === RoleEnum.PARTNER) {
      this.backendService.getCurrentOrdersForPartners(this.authenticationService.user.businesPartnerCompanyName).subscribe((orders) => {
        orders.body.forEach((order) => {
          this.orginalArrayCopy.push(this.tableService.createOrderTableCellFromOrderEntity(order));
        });
      });
    }
    else {
      this.backendService.getCurrentOrdersForPrivilligedUsers().subscribe((orders) => {
        orders.body.forEach((order) => {
          this.orginalArrayCopy.push(this.tableService.createOrderTableCellFromOrderEntity(order));
        });
      });
    }
  }

  ngAfterContentChecked(): void {
  }
  createOrdersForTableCellFromOrders(orders: Order[]): OrderforTableCell[] {
const orderForTableCel: OrderforTableCell[] = [];
orders.forEach((order) => {
  orderForTableCel.push(this.tableService.createOrderTableCellFromOrderEntity(order));
});
return orderForTableCel;
  }

  }
