import { Injectable } from '@angular/core';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralTableService {
  records: any[] = [];
  selectedId: number;
  constructor(private searchService: SearchService) {
  }


  getRecords(): any[] {
    return this.records;
  }

  addRecordToTable(record: any): void {
    this.records.push(record);
    this.searchService.orginalArrayCopy.push(record);
  }

  updateTableRecord(id: number, updatedRecord: any): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
        this.searchService.orginalArrayCopy[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: any, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
        this.searchService.orginalArrayCopy.splice(index, 1);
      }
    });
  }
}
