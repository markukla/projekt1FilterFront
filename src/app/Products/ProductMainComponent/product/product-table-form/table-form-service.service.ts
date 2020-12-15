import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
  material: string;

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

}

