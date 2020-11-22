import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgModel, Validators} from '@angular/forms';
import {MaterialService} from '../material.service';
import {Material} from '../materials/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../material-table.service';

@Component({
  selector: 'app-create-new-material',
  templateUrl: './create-new-material.component.html',
  styleUrls: ['./create-new-material.component.css']
})
export class CreateNewMaterialComponent {

  constructor(private materialTableService: MaterialTableService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {

  }


  // tslint:disable-next-line:typedef
  onSubmit(f: NgModel) {
    this.materialTableService.addRecordToTable(f.value);
    this.router.navigateByUrl('/');
  }


}
