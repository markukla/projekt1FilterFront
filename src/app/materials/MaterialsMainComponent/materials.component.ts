import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';


import {Material} from './material';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {NavigationEvent} from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import {NgModel} from '@angular/forms';
import {MaterialTableService} from '../MaterialServices/material-table.service';

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
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;


  constructor(public materialTableService: MaterialTableService,
              public materialBackendService: MaterialBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
  }

  /*
  * getMaterials(): void {
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
    }*/
  ngOnInit(): void {
    this.getRecords();
    this.materialId = this.materialTableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterContentChecked(): void {
    if (this.materials){
      this.recordNumbers = this.materials.length;
    }
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {

  }

  /*refreshComponentVievAfterNavigation(): void {
      this.router.events.subscribe((evt) => {
        if (evt) {
          this.getMaterials();
        }
      });
    }
     updateTableAfterMaterialUpdated(material: Material): void {
      for (let i = 0; i < this.materials.length; i++ ){
        if (this.materials[i].id === material.id){
          this.materials[i] = material;
        }
      }
    */

  /*
  does not work because for each use copy of orginal array
  this.materials.map((m: Material) => {
    if (m.id === material.id){
      m = material;
      console.log(`m.materialCode= ${m.materialCode}`);
    }
  });*/
  getRecords(): void {
    this.materialBackendService.getMaterials().subscribe((materials) => {
      this.materialTableService.materialList.length = 0;
      this.materialTableService.materialList = materials.body;
      this.materials = this.materialTableService.getMaterialsTable();
    });

  }

  deleteSelectedRecord(materialId: number): void {
    this.materialBackendService.deleteMaterialById(String(materialId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Materiał z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
    });
  }

  updateSelectedRecord(materialId: number): void {
    this.materialTableService.selectedId = materialId;
    this.router.navigateByUrl('/materials/update');
  }
}
