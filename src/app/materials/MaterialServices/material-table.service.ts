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
  constructor(private materialBackendService: MaterialBackendService) {
  }


  getMaterialsTable(): Material[] {
    this.materialBackendService.getMaterials().subscribe((response) => {
      this.materialList.length = 0;
      this.materialList.push(...response.body);
    });
    return this.materialList;
  }

  addRecordToTable(material: Material): Promise<Material> {
    return new Promise<Material>(resolve => {
      this.materialBackendService.addMaterials(material).subscribe(
        (response) => {
          this.materialList.push(response.body);
          resolve(response.body);
        });
    });
  }

  updateTableRecord(id: number, material: Material): void {
    this.materialBackendService.updateMaterialById(String(id), material).subscribe(
      (response) => {
        for (let i = 0; i < this.materialList.length; i++) {
          if (this.materialList[i].id === response.body.id) {
            this.materialList[i] = response.body;
          }
        }
      });
  }

  deleteRecordById(id: number): any {
    this.materialBackendService.deleteMaterialById(String(id))
      .subscribe((response) => {
        this.materialList.forEach((material: Material, index: number) => {
          if (material.id === id) {
            this.materialList.splice(index, 1);
          }
        });
      });

  }
}
