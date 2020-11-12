import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import {MaterialService} from '../material.service';
import {takeUntil} from 'rxjs/operators';
import {CreateMaterial} from './createMaterial';
import {strict} from 'assert';
import {Material} from '../materials/material';

@Component({
  selector: 'app-create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.css']
})
export class CreateNewMaterialComponent  {
  /*below fields required using standAlone ng-model but not while usine wit <form>*/
  materialCode: string;
  materialName: string;
  constructor(private materialService: MaterialService,
              private formBuilder: FormBuilder) {

  }
  /*emiting material as event enables to access to this event value from other component*/
  @Output()
  newMaterialCreatedEvent = new EventEmitter<Material>();
  // tslint:disable-next-line:typedef
  onSubmit(f: NgModel) {
    /*
    using ng model as a standalone control
    console.log(`material code= ${this.materialCode}`);
    const materialData: Material = {
      materialName: this.materialName,
      materialCode: this.materialCode

    };*/
    /*below using ng-model with <form> it is shortet because no declaring variables in controller required, form fields are automaticlly save as ngModel.value, when submit button press*/

    this.materialService.addMaterials(f.value).subscribe((data: Material) => {
    this.newMaterialCreatedEvent.emit(data);
    });
  }




}
