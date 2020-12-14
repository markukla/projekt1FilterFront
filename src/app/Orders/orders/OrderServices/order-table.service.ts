import { Injectable } from '@angular/core';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import Order from '../../OrdersTypesAndClasses/orderEntity';

@Injectable({
  providedIn: 'root'
})
export class OrderTableService {
  records: Order[] = [];
  selectedId: number;
  selectedRecord: Order;
  constructor() {
  }


  getRecords(): Order[] {
    return this.records;
  }

  addRecordToTable(record: Order): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: Order): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: Order, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
}
