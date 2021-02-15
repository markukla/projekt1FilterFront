import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import WorkingSideEnum from '../../../../Orders/OrdersTypesAndClasses/workingSideEnum';
import {TableFormServiceService} from './table-form-service.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {
  drawingTableFormNames,
  generalNamesInSelectedLanguage,
  orderNames
} from '../../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';

@Component({
  selector: 'app-product-table-form',
  templateUrl: './product-table-form.component.html',
  styleUrls: ['./product-table-form.component.css']
})
export class ProductTableFormComponent implements OnInit, AfterContentChecked {
  tableForm: FormGroup;
  bgImageVariable: string;
  workingSideExterinal: WorkingSideEnum = WorkingSideEnum.EXTERNAL;
  workingSideInternal: WorkingSideEnum = WorkingSideEnum.INTERNAL;
  orderTotalNumber: string;
  index: string;
  orderCreator: string;
  orderName: string;
  date: string;
  materialName: string;
  materialCode: string;
  Lvalue: string;  // value for second indexDimension
  Dvalue: string; // value for first index dimension
  productTypeName: string;
  productTypeCode: string;
  productTopCode: string;
  productBottomCode: string;
  materialPartialCodeForIndex: string;
  firstIndexDimension: string;
  secondIndexDimension: string;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;
  drawingTableFormNames = drawingTableFormNames;

  constructor(
    private backendService: ProductBackendService,
    private tableFormService: TableFormServiceService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
    this.setPropertiesTOEqualTableFormServiceProperties();
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNames, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.drawingTableFormNames, this.authenticationService.vocabulariesInSelectedLanguage);
  }


  ngAfterContentChecked(): void {
   this.setPropertiesTOEqualTableFormServiceProperties();
  }
  setPropertiesTOEqualTableFormServiceProperties(): void {
    this.orderTotalNumber = this.tableFormService.orderTotalNumber;
    this.index = this.tableFormService.index;
    this.orderCreator = this.tableFormService.orderCreator;
    this.orderName = this.tableFormService.orderName;
    this.tableForm = this.tableFormService.tableForm;
    this.materialName = this.tableFormService.materialName;
    this.materialCode = this.tableFormService.materialCode;
    this.Lvalue = this.tableFormService.Lvalue;
    this.Dvalue = this.tableFormService.Dvalue;
    if (this.tableFormService.date) {
      this.date = this.tableFormService.date.toLocaleDateString();
    }
    else {
      this.date = '';
    }
    this.productTypeName = this.tableFormService.productTypeName;
    this.productTypeCode = this.tableFormService.productTypeCode;
    this.productTopCode = this.tableFormService.productTopCode;
    this.productBottomCode = this.tableFormService.productBottomCode;
    this.materialPartialCodeForIndex = this.tableFormService.materialPartialCodeForIndex;
    this.firstIndexDimension = this.tableFormService.firstIndexDimension;
    this.secondIndexDimension = this.tableFormService.secondIndexDimension;
  }
}
