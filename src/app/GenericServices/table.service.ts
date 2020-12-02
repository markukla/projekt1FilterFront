import { Injectable } from '@angular/core';
import {Material} from '../materials/MaterialsMainComponent/material';
import {TableRecord} from './tableRecord';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:no-shadowed-variable align
export class TableService  {
  records: TableRecord[] = [];
  selectedId: number;
  constructor() {
  }


  getRecords(): TableRecord[] {
    return this.records;
  }

  addRecordToTable(material: TableRecord): void {
    this.records.push(material);
  }

  updateTableRecord(id: number, updatedMaterial: TableRecord): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedMaterial.id) {
        this.records[i] = updatedMaterial;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((material: TableRecord, index: number) => {
      if (material.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
}
