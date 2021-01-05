import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateOrderDto} from '../../../../Orders/OrdersTypesAndClasses/orderDto';
import WorkingSideEnum from '../../../../Orders/OrdersTypesAndClasses/workingSideEnum';
import OrderOperationMode from '../../../../Orders/OrdersTypesAndClasses/orderOperationMode';
import {allFirstIndexDimensionCodes, allSecondIndexDimensionCodes} from '../../../ProductTypesAndClasses/alreadyExistingDimensionList';

@Injectable({
  providedIn: 'root'
})
export class TableFormServiceService {
  tableForm: FormGroup;
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

  constructor() {
    this.initTableForm();
  }

  initTableForm(): void {
    this.tableForm = new FormGroup({
      workingTemperature: new FormControl(null, [Validators.required]),
      workingSide: new FormControl(null, [Validators.required]),
      antiEelectrostatic: new FormControl(false)
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

  public buildIndex(): void {
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
    if (this.Dvalue && this.Lvalue) {
      this.orderName = `${this.productTypeName}  ${this.Dvalue}  x  ${this.Lvalue} mm ${this.materialCode}`;
    } else if (this.Dvalue && !this.Lvalue) {
      this.orderName = `${this.productTypeName}  ${this.Dvalue}  x  0 mm ${this.materialCode}`;
    } else if (!this.Dvalue && this.Lvalue) {
      this.orderName = `${this.productTypeName}  0  x  ${this.Lvalue} mm ${this.materialCode}`;
    } else {
      this.orderName = `${this.productTypeName}  0  x  0 mm ${this.materialCode}`;
    }
  }

  /*  remember that createOrderDto is obtained in diffrentWay for diffrent modes*/
  setInitDataFromDrawingTableFromCreateOrderDto(createOrderDto: CreateOrderDto): void {
    this.resetTableFormServiceProperties();
    if (createOrderDto.orderTotalNumber) {
      this.orderTotalNumber = createOrderDto.orderTotalNumber;
    } else {
      this.orderTotalNumber = '';
    }
    if (createOrderDto.creator) {
      this.orderCreator = createOrderDto.creator.fulName;
    } else {
      this.orderCreator = '';
    }
    if (createOrderDto.data) {
      this.date = createOrderDto.data;
    } else {
      this.date = '';
    }
    if (createOrderDto.productMaterial) {
      this.materialCode = createOrderDto.productMaterial.materialCode;
      this.materialName = createOrderDto.productMaterial.materialName;
    } else {
      this.materialCode = '';
      this.materialName = '';
    }
    if (createOrderDto.product) {
      this.productTypeName = createOrderDto.product.productType.name;
      this.productTypeCode = createOrderDto.product.productType.code;
      this.productBottomCode = createOrderDto.product.productBottom.code;
      this.productTopCode = createOrderDto.product.productTop.code;
    } else {
      this.productTypeName = '';
      this.productTypeCode = '00';
      this.productBottomCode = '0';
      this.productTopCode = '0';
    }
    if (createOrderDto.orderDetails) {
      this.workingTemperature.setValue(createOrderDto.orderDetails.workingTemperature);
      this.workingSide.setValue(createOrderDto.orderDetails.workingSide);
      this.antiEelectrostatic.setValue(createOrderDto.orderDetails.antiEelectrostatic);
      if (createOrderDto.orderDetails.dimensions) {
        const dimensions = createOrderDto.orderDetails.dimensions;
        dimensions.forEach((dimension) => {
          if (allFirstIndexDimensionCodes.includes(dimension.dimensionId)) {
            this.Dvalue = dimension.dimensionvalue;
          }
          if (allSecondIndexDimensionCodes.includes(dimension.dimensionId)) {
            this.Lvalue = dimension.dimensionvalue;
          }
        });
      }
    }
    if (createOrderDto.index) {
      this.index = createOrderDto.index;
    } else {
      this.buildIndex();
    }
    if (createOrderDto.orderName) {
      this.orderName = createOrderDto.orderName;
    } else {
      this.setOrderName();
    }
  }

  enableTableForm(): void {
    this.antiEelectrostatic.enable();
    this.workingSide.enable();
    this.workingTemperature.enable();
  }

  disableTableForm(): void {
    this.antiEelectrostatic.disable();
    this.workingSide.disable();
    this.workingTemperature.disable();
  }

  resetTableFormServiceProperties(): void {
    this.index = '';
    this.orderCreator = '';
    this.orderName = '';
    this.date = '';
    this.materialName = '';
    this.materialCode = '';
    this.Lvalue = '';
    this.Dvalue = '';
    this.productTypeName = '';
    this.productTypeCode = '';
    this.productTopCode = '';
    this.productBottomCode = '';
    this.materialPartialCodeForIndex = '';
    this.firstIndexDimension = '';
    this.secondIndexDimension = '';
    this.antiEelectrostatic.setValue(false);
    this.workingSide.setValue(null);
    this.workingTemperature.setValue(null);
  }
}

