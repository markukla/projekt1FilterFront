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
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {ConfirmDeleteServiceService} from "../../ConfirmDelete/confirm-delete-service.service";

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
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;


  constructor(public materialTableService: GeneralTableService,
              public materialBackendService: MaterialBackendService,
              private searChService: SearchService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
  }

  /*
  * getMaterials(): void {
      this.materialService.getMaterials()
        // clone the newData object, using its known Config shape
        .subscribe((newData) => {
            this.materials = newData;

          }
        );
    }

    deleteMaterialById(id: number): any {
      this.materialService.deleteMaterialById(String(id))
        .subscribe((newData) => {
          this.deleTedRecordMessage = newData;
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
     updateTableAfterMaterialUpdated(materialName: Material): void {
      for (let i = 0; i < this.materials.length; i++ ){
        if (this.materials[i].id === materialName.id){
          this.materials[i] = materialName;
        }
      }
    */

  /*
  does not work because for each use copy of orginal array
  this.materials.map((m: Material) => {
    if (m.id === materialName.id){
      m = materialName;
      console.log(`m.materialCode= ${m.materialCode}`);
    }
  });*/

  getRecords(): void {
    this.materialBackendService.getRecords().subscribe((materials) => {
      this.materialTableService.records.length = 0;
      this.materialTableService.records = materials.body;
      this.materials = this.materialTableService.getRecords();
      this.searChService.orginalArrayCopy = [...this.materialTableService.getRecords()];
    });

  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.showConfirmDeleteWindow = true;
    this.materialTableService.selectedId = materialId;
  }
  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.materialBackendService.deleteRecordById(String(recordId)).subscribe((response) => {
        this.operationSuccessStatusMessage = 'Usunięto Materiał z bazy danych';
        this.materialTableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
      }, error => {
        this.operationFailerStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
        this.materialTableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
      });
    }
  }

  updateSelectedRecord(materialId: number): void {
    this.materialTableService.selectedId = materialId;
    this.router.navigateByUrl('/materials/update');
  }
}
