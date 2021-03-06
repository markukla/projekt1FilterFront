import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Material} from '../MaterialsMainComponent/material';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';
import {MaterialTableService} from '../MaterialServices/material-table.service';
import {HttpErrorResponse} from '@angular/common/http';
import HttpException from '../../helpers/ErrorHandling/httpException';
import {getBackendErrrorMesage} from '../../helpers/errorHandlingFucntion/handleBackendError';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {ValidateMaterialCodeUniqueService} from '../MaterialServices/validate-material-code-unique.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css']
})
export class UpdateMaterialComponent implements OnInit {
  operationStatusMessage: string;
  materialToUpdate: Material;
  materialToUpdateId: number;
  materialForm: FormGroup;

  constructor(private materialTableService: GeneralTableService,
              private materialBackendService: MaterialBackendService,
              public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.materialForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      materialCode: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6),   Validators.maxLength(6)], [this.validateMaterialCodeUniqueService.materialCodeValidatorForUpdate()]),
      // tslint:disable-next-line:max-line-length
      materialName: new FormControl('', [Validators.nullValidator && Validators.required], [this.validateMaterialCodeUniqueService.materialNameValidatorForUpdate()]),
    }, {updateOn: 'change'});
    this.materialToUpdateId = this.materialTableService.selectedId;
    console.log(`materialToUpdateId= ${this.materialToUpdateId}`);
    this.materialBackendService.findRecordById(String(this.materialToUpdateId)).subscribe((material) => {
        this.materialToUpdate = material.body;
        this.materialForm.controls.materialCode.setValue(this.materialToUpdate.materialCode);
        this.materialForm.controls.materialName.setValue(this.materialToUpdate.materialName);
      },
      error => {
        console.log(`This error occured: ${error.error}`);
      });
  }
  // tslint:disable-next-line:typedef
  get materialCode() {
    return this.materialForm.get('materialCode');
  }

  // tslint:disable-next-line:typedef
  get materialName() {
    return this.materialForm.get('materialName');
  }


  onSubmit(): void {
    // tslint:disable-next-line:max-line-length
    console.log(`materialFOrrmValu= ${this.materialForm.value}`);
    // tslint:disable-next-line:max-line-length
    this.materialBackendService.updateRecordById(String(this.materialTableService.selectedId), this.materialForm.value).subscribe((material) => {
        this.operationStatusMessage = 'dodano nowy materiał';
        this.resetMaterialFormValueAndOperationStatus();
      }, error => {
        const backendErrorMessage = getBackendErrrorMesage(error);
      // tslint:disable-next-line:max-line-length
        const materialNameAlreadyExistMessage = `Material with materialName=${this.materialForm.controls.materialName.value} already exists`;
      // tslint:disable-next-line:max-line-length
        const materialCodeAlreadyExistMessage = `Material with materialCode=${this.materialForm.controls.fulName.value} already exists`;
        const materialWithMaterialCodeAndNameAlreadyExistMesage = `Material with materialName=${this.materialForm.controls.materialName.value} and material code=${this.materialForm.controls.fulName.value} already exists`;


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
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }
}


