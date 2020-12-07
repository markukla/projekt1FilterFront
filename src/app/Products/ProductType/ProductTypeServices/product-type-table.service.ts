import { Injectable } from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import ProductType from '../../ProductTypesAndClasses/productType.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeTableService {

  records: ProductType[] = [];
  selectedId: number;
  selectedRecord: ProductType;
  constructor() {
  }


  getRecords(): ProductType[] {
    return this.records;
  }

  addRecordToTable(record: ProductType): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: ProductType): void {
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
