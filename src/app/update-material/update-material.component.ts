import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Material} from '../materials/material';
import {MaterialService} from '../material.service';
import {MaterialTableService} from '../material-table.service';

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css']
})
export class UpdateMaterialComponent implements OnInit {
  materialForm = new FormGroup({
    materialCode: new FormControl('', Validators.nullValidator && Validators.required),
    materialName: new FormControl('', Validators.nullValidator && Validators.required),
  });
  materialId: number;
  updatedMaterial: Material;
  @Output()
  updatedMaterialEvent = new EventEmitter<Material>();

  constructor(private materialTableService: MaterialTableService) {
  }

  ngOnInit(): void {
    this.materialId = this.materialTableService.selectedId;
  }


  onSubmit(): void {
    this.materialTableService.updateTableRecord(this.materialId, this.materialForm.value);
    this.materialForm.reset();
  }


}
