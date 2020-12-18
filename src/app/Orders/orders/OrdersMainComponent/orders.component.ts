import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import RoleEnum from '../../../Users/users/userTypes/roleEnum';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterContentChecked {

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


  constructor(public tableService: OrderTableService,
              public backendService: OrderBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              private authenticationService: AuthenticationService
  ) {
  }
  ngOnInit(): void {
    this.getRecords();
    this.materialId = this.tableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }
  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }
  getRecords(): void {
    if (this.authenticationService.userRole === RoleEnum.PARTNER) {
      const partnerCode: string = this.authenticationService.user.code;
      this.backendService.getCurrentOrdersForPartners(partnerCode).subscribe((records) => {
        this.tableService.records.length = 0;
        records.body.forEach((record) => {
            this.tableService.records.push(this.tableService.createOrderTableCellFromOrderEntity(record));
          }
        );
        this.records = this.tableService.getRecords();
      });
    } else if (this.authenticationService.userRole === RoleEnum.ADMIN || this.authenticationService.userRole === RoleEnum.EDITOR) {
      console.log('in get orders for privilligedUsers ')
      this.backendService.getCurrentOrdersForPrivilligedUsers().subscribe((records) => {
        this.tableService.records.length = 0;
        records.body.forEach((record) => {
          this.tableService.records.push(this.tableService.createOrderTableCellFromOrderEntity(record));
          }
        );
        this.records = this.tableService.getRecords();
      });
    }
  }
  deleteSelectedRecord(materialId: number): void {
    this.backendService.deleteRecordById(String(materialId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Materiał z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
    });
  }

  updateSelectedRecord(materialId: number): void {
    this.tableService.selectedId = materialId;
    this.router.navigateByUrl('/orders/update');
  }


  showDrawing(id: number): void {
    this.tableService.selectedId = id;
    this.router.navigateByUrl('/products/productDrawingBlueprint');
  }

  showOrderHistory(id: number): void {
  }
}