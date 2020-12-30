import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import {OrderTableService} from '../OrderServices/order-table.service';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {VersionRegisterTableService} from '../OrderServices/version-register-table.service';
import OrderVersionRegister from '../../OrdersTypesAndClasses/orderVersionRegister';
import Order from '../../OrdersTypesAndClasses/orderEntity';

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
  orderVersionRegister: OrderVersionRegister;
  ordersInRegister: Order[];


  constructor(
              public orderTableService: OrderTableService,
              public orderRegisterTableService: VersionRegisterTableService,
              public backendService: OrderBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.getRecords();
    this.materialId = this.orderTableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }

  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }

  getRecords(): void {
    this.backendService.findRecordById(String(this.orderTableService.selectedId)).subscribe((order) => {
      this.backendService.findOrderVersionRegisterById(String(order.body.orderVersionRegister.id)).subscribe((register) => {
          this.orderVersionRegister = register.body;
          this.ordersInRegister = this.orderVersionRegister.ordersInthisRegister;
        }, error => {
          console.error('could not get order version register');
        }
      );
    });
  }
  showDrawing(id: number): void {
    this.orderTableService.orderOperationMode = OrderOperationMode.SHOWDRAWING;
    this.orderTableService.selectedId = id;
    this.backendService.findRecordById(String(this.orderTableService.selectedId)).subscribe((order) => {
      this.orderTableService.orderOperationMode = OrderOperationMode.SHOWDRAWING;
      this.backendService.createOrderDtoForConfirmUpdateShowDrawing = this.backendService.getCreateOrderDtoFromOrder(order.body);
      this.router.navigateByUrl('orders/drawing');
      }, (error) => {
        console.log('can not find order to show drawing');
      }
    );

  }
}
