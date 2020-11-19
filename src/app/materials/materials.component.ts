import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MaterialService} from '../material.service';


import {Material} from './material';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnChanges, OnInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  @Input()
  materials: Material[];
  @Input()
  orginalMaterialsCopy: Material[];
  createNewMaterialDescription = 'Create new Material';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  updatedMaterrial: Material;

  constructor(private materialService: MaterialService) {
    this.getMaterials();
  }

  getMaterials(): void {
    this.materialService.getMaterials()
      // clone the data object, using its known Config shape
      .subscribe((data) => {
          this.materials = data;

        }
      );
  }

  deleteMaterialById(id: number): any {
    this.materialService.deleteMaterialById(String(id))
      .subscribe((data) => {
          this.deleTedMaterialMessage = data;
          this.getMaterials();
        }
      );
    /*let deletedMaterial: Material;
    this.materials.forEach(material => {
      if (material.id === id) {
        deletedMaterial = material;
      }
    });
    console.log(`deletedMaterial= ${deletedMaterial}`);
    this.materials.splice(this.materials.indexOf(deletedMaterial));*/
  }

  updateMaterialById(id: string, material: Material): void {
    this.materialService.updateMaterialById(id, material)

      .subscribe((data) => {
          this.updatedMaterrial = data;

        }
      );
  }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {
  }

}
