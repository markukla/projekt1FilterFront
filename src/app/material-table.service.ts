import {Injectable} from '@angular/core';
import {MaterialService} from './material.service';
import {Material} from './materials/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialTableService {
  materialList: Material[] = [];
  selectedId: number;

  constructor(private materialBackendService: MaterialService) {
  }


  getMaterialsTable(): Material[] {
    this.materialBackendService.getMaterials().subscribe((data: Material[]) => {
      this.materialList.length = 0;
      this.materialList.push(...data);
    });
    return this.materialList;
  }

  addRecordToTable(material: Material): void {
    this.materialBackendService.addMaterials(material).subscribe(
      data => {
        this.materialList.push(data);
      });

  }

  updateTableRecord(id: number, material: Material): void {
    this.materialBackendService.updateMaterialById(String(id), material).subscribe(
      updatedMaterial => {
        for (let i = 0; i < this.materialList.length; i++) {
          if (this.materialList[i].id === updatedMaterial.id) {
            this.materialList[i] = updatedMaterial;
          }
        }
      });
  }

  deleteRecordById(id: number): any {
    this.materialBackendService.deleteMaterialById(String(id))
      .subscribe((data) => {
        this.materialList.forEach((material: Material, index: number) => {
          if (material.id === id){
            this.materialList.splice(index, 1);
          }
        });
        });

      }
}
