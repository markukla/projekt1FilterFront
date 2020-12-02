import {Injectable} from '@angular/core';
import {MaterialBackendService} from './material-backend.service';
import {Material} from '../MaterialsMainComponent/material';
import {Observable, of} from 'rxjs';
import BackendErrorResponse from '../../helpers/ErrorHandling/backendErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class MaterialTableService {
  records: Material[] = [];
  selectedId: number;
  constructor() {
  }


  getRecords(): Material[] {
    return this.records;
  }

  addRecordToTable(material: Material): void {
          this.records.push(material);
  }

  updateTableRecord(id: number, updatedMaterial: Material): void {
        for (let i = 0; i < this.records.length; i++) {
          if (this.records[i].id === updatedMaterial.id) {
            this.records[i] = updatedMaterial;
          }
        }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((material: Material, index: number) => {
          if (material.id === id) {
            this.records.splice(index, 1);
          }
        });
  }
}
