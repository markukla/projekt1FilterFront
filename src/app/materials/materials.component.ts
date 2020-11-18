import {Component, Input, OnInit} from '@angular/core';
import {MaterialService} from '../material.service';


import {Material} from './material';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  @Input()
  materials: Material[];
  @Input()
  orginalMaterialsCopy: Material[];
  createNewMaterialDescription = 'Create new Material';

  constructor(private materialService: MaterialService) {
    this.getMaterials();
  }

  getMaterials(): void {
    this.materialService.getMaterials()
      // clone the data object, using its known Config shape
      .subscribe((data) => {
          this.materials = data;

        }
      ); /*remember that it can not be {...data}
      cause it means to create new json object with collection inside {collection} and ngfor does not apply to objects*/
    this.materialService.getMaterials()
      // clone the data object, using its known Config shape
      .subscribe((data) => {
          this.orginalMaterialsCopy = data;

        }
      );

  }

  pushCreatedNewMaterialToMaterialList(material: Material): void {
    this.materials.push(material);


  }

  ngOnInit(): void {


  }

}
