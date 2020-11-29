import { Injectable } from '@angular/core';
import User from '../../../Users/users/userTypes/user';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerTableService {
  tableRecords: User[] = [];
  selectedId: number;
  constructor() {
  }


  getTableRecords(): User[] {
    return this.tableRecords;
  }

  addRecordToTable(item: User): void {
    this.tableRecords.push(item);
  }

  updateTableRecord(id: number, updatedRecord: User): void {
    for (let i = 0; i < this.tableRecords.length; i++) {
      if (this.tableRecords[i].id === updatedRecord.id) {
        this.tableRecords[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.tableRecords.forEach((item: User, index: number) => {
      if (item.id === id) {
        this.tableRecords.splice(index, 1);
      }
    });
  }
}
