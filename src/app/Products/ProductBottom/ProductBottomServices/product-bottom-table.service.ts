import { Injectable } from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductBottomTableService {


  records: ProductBottom[] = [];
  selectedId: number;
  constructor() {
  }


  getRecords(): ProductBottom[] {
    return this.records;
  }

  addRecordToTable(record: ProductBottom): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: ProductBottom): void {
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
