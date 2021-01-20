import { Injectable } from '@angular/core';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import Language from '../LanguageTypesAndClasses/languageEntity';

@Injectable({
  providedIn: 'root'
})
export class LanguageTableService {

  records: Language[] = [];
  selectedId: number;
  selectedRecord: Language;
  constructor() {
  }


  getRecords(): Language[] {
    return this.records;
  }

  addRecordToTable(record: Language): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: Language): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: Language, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
}
