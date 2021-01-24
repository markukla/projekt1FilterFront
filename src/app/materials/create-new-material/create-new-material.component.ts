import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';
import {Material} from '../MaterialsMainComponent/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../MaterialServices/material-table.service';
import {ValidateMaterialCodeUniqueService} from '../MaterialServices/validate-material-code-unique.service';
import BackendErrorResponse from '../../helpers/ErrorHandling/backendErrorResponse';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';

@Component({
  selector: 'app-create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.css']
})
export class CreateNewMaterialComponent implements OnInit{
  operationMessage: string;
  showoperationStatusMessage: string;

  constructor( private authenticationService: AuthenticationService,
              private materialbackendService: MaterialBackendService,
              public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {

  }
  materialForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    materialCode: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6),   Validators.maxLength(6)], [this.validateMaterialCodeUniqueService.materialCodeValidator()]),
    // tslint:disable-next-line:max-line-length
    materialName: new FormControl('', [Validators.nullValidator && Validators.required], [this.validateMaterialCodeUniqueService.materialNameValidator()]),
  }, {updateOn: 'change'});
// tslint:disable-next-line:typedef
  get materialCode() {
    return this.materialForm.get('materialCode');
  }

  // tslint:disable-next-line:typedef
  get materialName() {
    return this.materialForm.get('materialName');
  }
  onSubmit(): void {
    this.materialbackendService.addRecords(this.materialForm.value).subscribe((material) => {
      this.showoperationStatusMessage = 'Dodano nowego użytkwonika';
      this.cleanOperationMessage();
    }, error => {
      this.showoperationStatusMessage = 'Wystąpił bląd, nie udało się dodać nowego użytkownika. Spróbuj ponownie';
      this.cleanOperationMessage();
    });
 }
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }

  ngOnInit(): void {
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }

}
