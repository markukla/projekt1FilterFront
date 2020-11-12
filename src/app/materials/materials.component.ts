import { Component, OnInit } from '@angular/core';
import {MaterialService} from '../material.service';
import Material from '../../../../project1FilterBackend/src/Models/Materials/material.entity';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  materials: Material[];
  serchInCode: string;
  orginalMaterialsCopy: Material[];

  constructor(private materialService: MaterialService) {
    this.getMaterials();
  }

  getMaterials(): void {
    this.materialService.getMaterials()
      // clone the data object, using its known Config shape
      .subscribe((data) => {
        this.materials = data;
        this.orginalMaterialsCopy = data;
      }
        ); /*remember that it can not be {...data}
      cause it means to create new json object with collection inside {collection} and ngfor does not apply to objects*/
  }

  pushCreatedNewMaterialToMaterialList(material: Material): void {
    this.materials.push(material);


  }

  ngOnInit(): void {


  }

  filterByCode(): void {
    console.log(`filtering by: ${this.serchInCode}`);
    this.materials = this.orginalMaterialsCopy.filter(
      x => x.materialCode.includes(this.serchInCode)
    );
  }
}
