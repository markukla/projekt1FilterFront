import {Injectable} from '@angular/core';
import {MaterialBackendService} from './material-backend.service';
import {Material} from '../MaterialsMainComponent/material';
import {Observable, of} from 'rxjs';
import BackendErrorResponse from '../../helpers/ErrorHandling/backendErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class MaterialTableService {
  materialList: Material[] = [];
  selectedId: number;
  constructor() {
  }


  getMaterialsTable(): Material[] {
    return this.materialList;
  }

  addRecordToTable(material: Material): void {
          this.materialList.push(material);
  }

  updateTableRecord(id: number, updatedMaterial: Material): void {
        for (let i = 0; i < this.materialList.length; i++) {
          if (this.materialList[i].id === updatedMaterial.id) {
            this.materialList[i] = updatedMaterial;
          }
        }
  }

  deleteRecordById(id: number): any {
    this.materialList.forEach((material: Material, index: number) => {
          if (material.id === id) {
            this.materialList.splice(index, 1);
          }
        });
  }
}
