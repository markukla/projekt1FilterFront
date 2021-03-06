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
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';

import {OperationStatusServiceService} from '../../OperationStatusComponent/operation-status/operation-status-service.service';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from '../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {generalNamesInSelectedLanguage} from '../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';

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
  materialNamesInSelectedLanguage = {
    materialCode: '',
    materialName: '',
    addNewMaterial: '',
    quantity: '',
    search: ''
  };
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;


  constructor(public tableService: GeneralTableService,
              public backendService: MaterialBackendService,
              private searChService: SearchService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              public statusService: OperationStatusServiceService,
              private authenticationService: AuthenticationService
  ) {
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
    // tslint:disable-next-line:max-line-length
    this.initColumnNamesInSelectedLanguage();
    this.getRecords();
    this.materialId = this.tableService.selectedId;
  }

  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.materialNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
  }

  ngAfterContentChecked(): void {
    if (this.materials) {
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
    this.backendService.getRecords().subscribe((materials) => {
      this.tableService.records.length = 0;
      this.tableService.records = materials.body;
      this.materials = this.tableService.getRecords();
      this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
    });

  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = materialId;
  }

  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteRecordById(String(recordId)).subscribe((response) => {
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      }, error => {
        this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      });
    } else {
      this.showConfirmDeleteWindow = false;
    }
  }

  updateSelectedRecord(materialId: number): void {
    this.tableService.selectedId = materialId;
    this.router.navigateByUrl('/materials/update');
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
