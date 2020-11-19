import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MaterialService} from '../material.service';


import {Material} from './material';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {NavigationEvent} from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';

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

  constructor(private materialService: MaterialService,
              private router: Router) {
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

      });
  }

  updateMaterialById(id: string, material: Material): void {
    this.materialService.updateMaterialById(id, material)

      .subscribe((data) => {
          this.updatedMaterrial = data;

        }
      );
  }
  ngOnInit(): void {
    this.getMaterials();
    this.refreshComponentVievAfterNavigation();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {

  }

  refreshComponentVievAfterNavigation(): void  {
  this.router.events.subscribe((evt) => {
  if (evt) {
    this.getMaterials();
  }
});
}

}
