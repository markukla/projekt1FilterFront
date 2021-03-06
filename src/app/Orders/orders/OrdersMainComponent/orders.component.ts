import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import RoleEnum from '../../../Users/users/userTypes/roleEnum';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {BusinessPartnerTableService} from '../../../BusinessPartners/business-partners/BusinessPartnerServices/business-partner-table.service';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {BusinesPartnerBackendService} from '../../../BusinessPartners/business-partners/BusinessPartnerServices/busines-partner-backend.service';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {SearchService} from '../../../helpers/directive/SearchDirective/search.service';
import {ProductMiniatureService} from '../productMiniature/productMiniatureService/product-miniature.service';
import {OperationStatusServiceService} from '../../../OperationStatusComponent/operation-status/operation-status-service.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  generalNamesInSelectedLanguage, generalUserNames,
  orderNames
} from '../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterContentChecked {

  @Input()
  records: OrderforTableCell[];
  createNewRecordDescription: string;
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;
  partnerIdForOrdersShow: string;
  ordersOfBusinessPartner: Order[];
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  orderNames: any;
  generalUserNames: any;
  generalNamesInSelectedLanguage: any;


  constructor(public tableService: GeneralTableService,
              public businessPartnerbackendService: BusinesPartnerBackendService,
              private productMiniatureService: ProductMiniatureService,
              public backendService: OrderBackendService,
              private router: Router,
              private route: ActivatedRoute,
              private searChService: SearchService,
              private activedIdParam: ActivatedRoute,
              private authenticationService: AuthenticationService,
              public statusService: OperationStatusServiceService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.partnerIdForOrdersShow = queryParams.get('patnerId');
    });
    this.initColumnNamesInSelectedLanguage();
    this.getRecords();
    this.materialId = this.tableService.selectedId;
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-lengt
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
    this.generalUserNames = this.authenticationService.userNamesInSelectedLanguage;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.deleteButtonInfo = this.generalNamesInSelectedLanguage.deleteButtonInfo;
    this.updateButtonInfo = this.generalNamesInSelectedLanguage.updateButtonInfo;
    this.createNewRecordDescription = this.orderNames.createNewOrder;
  }

  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }

  getRecords(): void {
    if (this.partnerIdForOrdersShow){
      this.tableService.records.length = 0;
      this.businessPartnerbackendService.findRecordById(this.partnerIdForOrdersShow).subscribe((partner) => {
        this.ordersOfBusinessPartner = partner.body.ordersOfPartner;
        this.ordersOfBusinessPartner.forEach((record) => {
            this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(record));
          }
        );
        this.records = this.tableService.getRecords();
        this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
      });
    }
    else if (this.authenticationService.userRole === RoleEnum.PARTNER) {
      const partnerCode: string = this.authenticationService.user.code;
      this.backendService.getCurrentOrdersForPartners(partnerCode).subscribe((records) => {
        this.tableService.records.length = 0;
        records.body.forEach((record) => {
            this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(record));
          }
        );
        this.records = this.tableService.getRecords();
        this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
      });
    } else if (this.authenticationService.userRole === RoleEnum.ADMIN || this.authenticationService.userRole === RoleEnum.EDITOR) {
      console.log('in get orders for privilligedUsers ');
      this.backendService.getCurrentOrdersForPrivilligedUsers().subscribe((records) => {
        this.tableService.records.length = 0;
        records.body.forEach((record) => {
            this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(record));
          }
        );
        this.records = this.tableService.getRecords();
        this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
      });
    }
  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = materialId;
  }
  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteOrderWithVersionRegisterByCurrentId(String(recordId)).subscribe((response) => {
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      }, error => {
        this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      });
    }
    else {
      this.showConfirmDeleteWindow = false;
    }
  }

  updateSelectedRecord(selectedId: number): void {
    this.backendService.createOrderDtoForConfirmUpdateShowDrawing = null;
    this.productMiniatureService.selectedProduct = null;
    this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = false;
    this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${selectedId}&mode=${OrderOperationMode.UPDATE}`);
  }


  showDrawing(id: number): void {
      this.router.navigateByUrl(`orders/drawing?orderId=${id}&mode=${OrderOperationMode.SHOWDRAWING}`);
  }

  showOrderHistory(id: number): void {
    this.router.navigateByUrl(`orders/orderVersionRegister?orderId=${id}`);
  }

  createNewOrder(): void {
    this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = false;
    this.backendService.createOrderDtoForConfirmUpdateShowDrawing = null;
    this.productMiniatureService.selectedProduct = null;
    this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CREATENEW}`);
  }
}
