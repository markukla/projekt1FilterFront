import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {HttpClientModule} from '@angular/common/http';
import {MaterialsComponent} from './materials/materials.component';
import { CreateNewMaterialComponent } from './create-new-material/create-new-material.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortDirective } from './directive/sort.directive';
import { SearchDirective } from './directive/search.directive';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    MaterialsComponent,
    CreateNewMaterialComponent,
    SortDirective,
    SearchDirective
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: MaterialsComponent },
      { path: 'add', component: CreateNewMaterialComponent }
    ])

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
