import { Component, OnInit } from '@angular/core';
import {MaterialService} from '../material.service';
import Material from '../../../../project1FilterBackend/src/Models/Materials/material.entity';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  materials: Material[];



 /*private materialService: MaterialService*/
  constructor(private materialService: MaterialService) {
    this.getMaterials();
  }

  getMaterials(): void {
    this.materialService.getMaterials()
      // clone the data object, using its known Config shape
      .subscribe((data) => this.materials = data); /*remember that it can not be {...data}
      cause it means to create new json object with collection inside {collection} and ngfor does not apply to objects*/
  }

  ngOnInit(): void {
  /*this.materials =  this.materialService.getMaterials();*/
  }




}
