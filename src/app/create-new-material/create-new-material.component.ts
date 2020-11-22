import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import {MaterialBackendService} from '../material-backend.service';
import {Material} from '../materials/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../material-table.service';

@Component({
  selector: 'app-create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.css']
})
export class CreateNewMaterialComponent {
  operationMessage: string;
  showoperationMessage: boolean;

  constructor(private materialTableService: MaterialTableService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {

  }

  materialForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    materialCode: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    materialName: new FormControl('', Validators.nullValidator && Validators.required),
  });

  // tslint:disable-next-line:typedef
  get materialCode() {
    return this.materialForm.get('materialCode');
  }

  // tslint:disable-next-line:typedef
  get materialName() {
    return this.materialForm.get('materialName');
  }


  onSubmit(): void {
    this.showoperationMessage = true;

    const material: Material = this.materialTableService.addRecordToTable(this.materialForm.value);
    console.log(` added material code = ${material.materialCode}`);
    if (material) {
      this.operationMessage = 'new material created';
    } else if (!material) {
      this.operationMessage = 'an error occured try again';
    }
    setTimeout(() => {
      this.showoperationMessage = false;
    }, 1500);
  }

  closeAndGoBack(): void {
    this.router.navigateByUrl('/');
  }


}
