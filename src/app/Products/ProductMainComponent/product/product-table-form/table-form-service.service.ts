import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import Product from '../../../ProductTypesAndClasses/product.entity';
import {Material} from '../../../../materials/MaterialsMainComponent/material';

@Injectable({
  providedIn: 'root'
})
export class TableFormServiceService {
  tableForm: FormGroup;
  orderNumber: string;
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

  constructor() {
    this.initTableForm();
  }

  initTableForm(): void {
    this.tableForm = new FormGroup({
      workingTemperature: new FormControl(null, [Validators.required]),
      workingSide: new FormControl(null, [Validators.required]),
      antiEelectrostatic: new FormControl(null)
    });
  }

  // tslint:disable-next-line:typedef
  get workingTemperature() {
    return this.tableForm.get('workingTemperature');
  }

  // tslint:disable-next-line:typedef
  get workingSide() {
    return this.tableForm.get('workingSide');
  }

  // tslint:disable-next-line:typedef
  get antiEelectrostatic() {
    return this.tableForm.get('antiEelectrostatic');
  }

  public buildIndex(DValue: string, LValue: string ): void {
    this.Dvalue = DValue;
    this.Lvalue = LValue;
    this.setMaterialPartialCodeForIndex();
    this.setFirstIndexDimension();
    this.setSecondIndexDimension();
    this.index = `W${this.productTypeCode + this.productTopCode + this.productBottomCode + this.materialPartialCodeForIndex + this.firstIndexDimension + this.secondIndexDimension}`;
  }

  private setFirstIndexDimension(): void {
    if (this.Dvalue) {
      if (this.Dvalue.length === 4) {
        this.firstIndexDimension = `0${this.Dvalue}`;
      }
      if (this.Dvalue.length === 3) {
        this.firstIndexDimension = `00${this.Dvalue}`;
      }
      if (this.Dvalue.length === 2) {
        this.firstIndexDimension = `000${this.Dvalue}`;
      }
      if (this.Dvalue.length === 1) {
        this.firstIndexDimension = `0000${this.Dvalue}`;
      }
    } else {
      this.firstIndexDimension = `00000`;
    }
  }

 private setSecondIndexDimension(): void {
    if (this.Lvalue) {
      if (this.Lvalue.length === 5) {
        this.secondIndexDimension = `${this.Lvalue}`;
      }
      if (this.Lvalue.length === 4) {
        this.secondIndexDimension = `0${this.Lvalue}`;
      }
      if (this.Lvalue.length === 3) {
        this.secondIndexDimension = `00${this.Lvalue}`;
      }
      if (this.Lvalue.length === 2) {
        this.secondIndexDimension = `000${this.Lvalue}`;
      }
      if (this.Lvalue.length === 1) {
        this.secondIndexDimension = `0000${this.Lvalue}`;
      }
    } else {
      this.secondIndexDimension = `00000`;
    }
  }

  private setMaterialPartialCodeForIndex(): void {
    if (this.materialCode && this.materialCode.length > 0) {
      this.materialPartialCodeForIndex = this.materialCode.substring(3);
    } else {
      this.materialPartialCodeForIndex = '000';
    }

  }

  public setOrderName(): void {
    this.orderName = `${this.productTypeName}  ${this.Dvalue}  x  ${this.Lvalue} mm ${this.materialCode}`;
  }

  // tslint:disable-next-line:max-line-length
  setNonDimensionOrIndexRelateDataForDrawingTable(orderNumber: string, orderCreator: string, date: string, selectedProduct: Product, selectedMaterial: Material): void {
    if (orderNumber) {
      this.orderNumber = orderNumber;
    } else {
      this.orderNumber = '';
    }

    if (orderCreator) {
      this.orderCreator = orderCreator;
    } else {
      this.orderCreator = '';
    }
    if (date) {
      this.date = date;
    } else {
      this.date = '';
    }
    if (selectedMaterial) {
      this.materialCode = selectedMaterial.materialCode;
      this.materialName = selectedMaterial.materialName;
    } else {
      this.materialCode = '';
      this.materialName = '';
    }
    if (selectedMaterial) {
      this.productTypeName = selectedProduct.productType.name;
      this.productTypeCode = selectedProduct.productType.code;
      this.productBottomCode = selectedProduct.productBottom.code;
      this.productTopCode = selectedProduct.productTop.code;
    } else {
      this.productTypeName = '';
      this.productTypeCode = '00';
      this.productBottomCode = '0';
      this.productTopCode = '0';
    }
  }
  resetTableFormServiceProperties(): void{
    this.orderNumber = undefined;
    this.index = undefined;
    this.orderCreator = undefined;
    this.orderName = undefined;
    this.date = undefined;
    this.materialName = undefined;
    this.materialCode = undefined;
    this. Lvalue = undefined;
    this.Dvalue = undefined;
    this.productTypeName = undefined;
    this.productTypeCode = undefined;
    this.productTopCode = undefined;
    this.productBottomCode = undefined;
    this.materialPartialCodeForIndex = undefined;
    this.firstIndexDimension = undefined;
    this.secondIndexDimension = undefined;
  }
}

