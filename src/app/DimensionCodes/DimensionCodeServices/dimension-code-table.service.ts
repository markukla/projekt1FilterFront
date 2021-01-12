import { Injectable } from '@angular/core';
import ProductType from '../../Products/ProductTypesAndClasses/productType.entity';
import ProductTop from '../../Products/ProductTypesAndClasses/productTop.entity';
import DimensionCode from '../DimensionCodesTypesAnClasses/diemensionCode.entity';

@Injectable({
  providedIn: 'root'
})
export class DimensionCodeTableService {
  records: DimensionCode[] = [];
  selectedId: number;
  selectedRecord: DimensionCode;
  constructor() {
  }


  getRecords(): DimensionCode[] {
    return this.records;
  }

  addRecordToTable(record: DimensionCode): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: DimensionCode): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: DimensionCode, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
}
