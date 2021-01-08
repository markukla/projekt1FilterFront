import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import {OrderTableService} from '../OrderServices/order-table.service';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {VersionRegisterTableService} from '../OrderServices/version-register-table.service';
import OrderVersionRegister from '../../OrdersTypesAndClasses/orderVersionRegister';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {Sort} from '../../../util/sort';

@Component({
  selector: 'app-order-version-register',
  templateUrl: './order-version-register.component.html',
  styleUrls: ['./order-version-register.component.css']
})
export class OrderVersionRegisterComponent implements OnInit, AfterContentChecked {

  @Input()
  records: OrderforTableCell[];
  createNewRecordDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;
  selectedOrderId: string;
  orderVersionRegister: OrderVersionRegister;
  ordersInRegister: Order[];


  constructor(
    public orderTableService: OrderTableService,
    public orderRegisterTableService: VersionRegisterTableService,
    public backendService: OrderBackendService,
    private router: Router,
    private route: ActivatedRoute,
    private activedIdParam: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.records = [];
    this.route.queryParamMap.subscribe(queryParams => {
      this.selectedOrderId = queryParams.get('orderId');
    });
    this.getRecords();
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }

  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }

  getRecords(): void {
    this.backendService.findRecordById(this.selectedOrderId).subscribe((order) => {
      this.backendService.findOrderVersionRegisterById(String(order.body.orderVersionRegister.id)).subscribe((register) => {
          this.orderVersionRegister = register.body;
          this.ordersInRegister = this.orderVersionRegister.ordersInthisRegister;
          this.ordersInRegister.forEach((order) => {
              this.records.push(this.orderTableService.createOrderTableCellFromOrderEntity(order));
              const sort = new Sort();
              this.records.sort(sort.startSort('date', 'desc', 'date'));
            }
          );
        }, error => {
          console.error('could not get order version register');
        }
      );
    });
  }

  showDrawing(id: number): void {
    this.router.navigateByUrl(`orders/drawing?orderId=${id}&mode=${OrderOperationMode.SHOWDRAWING}`);
  }
}
