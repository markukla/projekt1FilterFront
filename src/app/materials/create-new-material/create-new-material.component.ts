import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';
import {Material} from '../MaterialsMainComponent/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../MaterialServices/material-table.service';
import {ValidateMaterialCodeUniqueService} from '../MaterialServices/validate-material-code-unique.service';
import BackendErrorResponse from '../../helpers/ErrorHandling/backendErrorResponse';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.css']
})
export class CreateNewMaterialComponent implements OnInit{
  operationMessage: string;
  showoperationMessage: boolean;
  materialCreated: boolean;

  constructor(
              private materialTableService: MaterialTableService,
              public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {

  }

  materialForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    materialCode: new FormControl('', [Validators.nullValidator, Validators.required, /*Validators.minLength(6),*/  Validators.maxLength(6)], [this.validateMaterialCodeUniqueService.materialCodeValidator()]),
    materialName: new FormControl('', Validators.nullValidator && Validators.required),
  }, {updateOn: 'blur'}); /*blur means if user clicks outside the control*/

  // tslint:disable-next-line:typedef
  get materialCode() {
    return this.materialForm.get('materialCode');
  }

  // tslint:disable-next-line:typedef
  get materialName() {
    return this.materialForm.get('materialName');
  }


 async onSubmit(): Promise<void> {
    console.log('on submit execution');
    this.showoperationMessage = true;
    try{
      console.log('try execution');
      const material = await this.materialTableService.addRecordToTable(this.materialForm.value);
      console.log(`material Code= ${material.materialCode}`);
      if (material) {
        this.operationMessage = 'new material created';
      }
      else {
        this.operationMessage = 'something went wrong try again';
      }
      } catch (e) {
      console.log(`catch execution`);
      this.operationMessage = `an error occured`;}
    setTimeout(() => {
     this.showoperationMessage = false;
   }, 2000);
 }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
  }

}
