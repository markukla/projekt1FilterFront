import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import WorkingSideEnum from '../../../../Orders/OrdersTypesAndClasses/workingSideEnum';
import {TableFormServiceService} from './table-form-service.service';

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
  orderNumber: string;
  index: string;
  orderCreator: string;
  orderName: string;
  date: string;
  material: string;

  constructor(
    private backendService: ProductBackendService,
    private tableFormService: TableFormServiceService
  ) { }
  ngOnInit(): void {
    this.orderNumber = this.tableFormService.orderNumber;
    this.index = this.tableFormService.index;
    this.orderCreator = this.tableFormService.orderCreator;
    this.orderName = this.tableFormService.orderName;
    this.tableForm = this.tableFormService.tableForm;
    this.material = this.tableFormService.material;
    this.bgImageVariable = this.backendService.drawingPaths.urlOfOrginalDrawing;
  }

  ngAfterContentChecked(): void {
    this.orderNumber = this.tableFormService.orderNumber;
    this.index = this.tableFormService.index;
    this.orderCreator = this.tableFormService.orderCreator;
    this.orderName = this.tableFormService.orderName;
    this.tableForm = this.tableFormService.tableForm;
    this.material = this.tableFormService.material;
  }
}
