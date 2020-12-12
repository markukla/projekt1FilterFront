import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductBackendService} from '../ProductServices/product-backend.service';
import WorkingSideEnum from '../../../../Orders/OrdersTypesAndClasses/workingSideEnum';
import {TableFormServiceService} from './table-form-service.service';

@Component({
  selector: 'app-product-table-form',
  templateUrl: './product-table-form.component.html',
  styleUrls: ['./product-table-form.component.css']
})
export class ProductTableFormComponent implements OnInit {
  tableForm: FormGroup;
  bgImageVariable: string;
  workingSideExterinal: WorkingSideEnum = WorkingSideEnum.EXTERNAL;
  workingSideInternal: WorkingSideEnum = WorkingSideEnum.INTERNAL;

  constructor(
    private backendService: ProductBackendService,
    private tableFormService: TableFormServiceService
  ) { }
  ngOnInit(): void {
    this.tableForm = this.tableFormService.tableForm;
    this.bgImageVariable = this.backendService.drawingPaths.urlOfOrginalDrawing;
    console.log(` this.bgImageVariable= ${this.bgImageVariable}`);
  }
}
