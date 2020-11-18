import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import {MaterialService} from '../material.service';
import {Material} from '../materials/material';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.css']
})
export class CreateNewMaterialComponent {

  constructor(private materialService: MaterialService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute) {

  }


  // tslint:disable-next-line:typedef
  onSubmit(f: NgModel) {
    this.materialService.addMaterials(f.value).subscribe((data: Material) => {
      console.log(data);
    });
  }


}
