import { Injectable } from '@angular/core';
import ProductType from '../../../ProductTypesAndClasses/productType.entity';
import ProductTop from '../../../ProductTypesAndClasses/productTop.entity';
import Product from '../../../ProductTypesAndClasses/product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductTableService {

  records: Product[] = [];
  selectedId: number;
  selectedRecord: Product;
  constructor() {
  }


  getRecords(): Product[] {
    return this.records;
  }

  addRecordToTable(record: Product): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: Product): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: Product, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
}
