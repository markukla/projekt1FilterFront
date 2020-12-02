import { Injectable } from '@angular/core';
import {MaterialTableService} from '../../../materials/MaterialServices/material-table.service';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductTopTableService  {

  records: ProductTop[] = [];
  selectedId: number;
  constructor() {
  }


  getRecords(): ProductTop[] {
    return this.records;
  }

  addRecordToTable(record: ProductTop): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: ProductTop): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: ProductTop, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
}
