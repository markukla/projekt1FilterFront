import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Material from '../../../project1FilterBackend/src/Models/Materials/material.entity';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  materials: any;


  constructor(private http: HttpClient) { }


  // tslint:disable-next-line:typedef
   getMaterials() {
    return this.http.get<Material[]>('http://localhost:5000/materials');
  }

  // tslint:disable-next-line:typedef
   public addMaterials = function(material: Material) {
    return this.http.post(this.rootURL + '/materials', {material});
  };
}
