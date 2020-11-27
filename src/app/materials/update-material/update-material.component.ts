import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Material} from '../MaterialsMainComponent/material';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';
import {MaterialTableService} from '../MaterialServices/material-table.service';
import {HttpErrorResponse} from '@angular/common/http';
import HttpException from '../../helpers/ErrorHandling/httpException';
import {getBackendErrrorMesage} from '../../helpers/errorHandlingFucntion/handleBackendError';

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css']
})
export class UpdateMaterialComponent implements OnInit {
  operationStatusMessage: string;
  materialToUpdate: Material;
  materialToUpdateId: number;
  materialForm = new FormGroup({
    materialCode: new FormControl('', ),
    materialName: new FormControl('', )
  });

  constructor(private materialTableService: MaterialTableService,
              private materialBackendService: MaterialBackendService) {
  }

  ngOnInit(): void {
    this.materialToUpdateId = this.materialTableService.selectedId;
    this.materialBackendService.findMaterialById(String(this.materialToUpdateId)).subscribe((material) => {
        this.materialToUpdate = material.body;
        this.materialForm.controls.materialCode.setValue(this.materialToUpdate.materialCode);
        this.materialForm.controls.materialName.setValue(this.materialToUpdate.materialName);
      },
      error => {
        console.log(`This error occured: ${error.error}`);
      });
  }


  onSubmit(): void {
    // tslint:disable-next-line:max-line-length
    this.materialBackendService.updateMaterialById(String(this.materialTableService.selectedId), this.materialForm.value).subscribe((material) => {
        this.operationStatusMessage = 'dodano nowy materiał';
        this.resetMaterialFormValueAndOperationStatus();
      }, error => {
        const backendErrorMessage = getBackendErrrorMesage(error);
      // tslint:disable-next-line:max-line-length
        const materialNameAlreadyExistMessage = `Material with materialName=${this.materialForm.controls.materialName.value} already exists`;
      // tslint:disable-next-line:max-line-length
        const materialCodeAlreadyExistMessage = `Material with materialCode=${this.materialForm.controls.materialCode.value} already exists`;
        const materialWithMaterialCodeAndNameAlreadyExistMesage = `Material with materialName=${this.materialForm.controls.materialName.value} and material code=${this.materialForm.controls.materialCode.value} already exists`;


        if (backendErrorMessage.includes(materialWithMaterialCodeAndNameAlreadyExistMesage)) {
          this.operationStatusMessage = 'Nie zaktualizowano materiału. Inny Materiał z podaną nazwą i kodem już istnieje';
        } else if (backendErrorMessage.includes(materialCodeAlreadyExistMessage)) {
          this.operationStatusMessage = 'Nie zaktualizowano materiału. Inny Materiał z podanym kodem  już istnieje';
        } else if (backendErrorMessage.includes(materialNameAlreadyExistMessage)){
          this.operationStatusMessage = 'Nie zaktualizowano materiału. Inny Materiał z podaną nazwą już istnieje';
        } else {
          this.operationStatusMessage = 'Wystąpił błąd, nie zaktualizowano materiału';
        }
        this.resetMaterialFormValueAndOperationStatus();
      }
    );


  }
 resetMaterialFormValueAndOperationStatus(): void {
    setTimeout(() => {
      this.materialForm.reset();
      this.operationStatusMessage = '';
    }, 1500);
  }
}


