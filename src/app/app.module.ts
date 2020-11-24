import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialsComponent} from './materials/materials.component';
import { CreateNewMaterialComponent } from './create-new-material/create-new-material.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortDirective } from './directive/sort.directive';
import { SearchDirective } from './directive/search.directive';
import {RouterModule} from '@angular/router';
import { UpdateMaterialComponent } from './update-material/update-material.component';
import {MaterialBackendService} from './material-backend.service';
import {ValidateMaterialCodeUniqueService} from './validate-material-code-unique.service';
import {MaterialTableService} from './material-table.service';
import { LoginComponent } from './LoginandLogOut/login/loginComponent/login.component';
import { HeaderComponent } from './header/header/header.component';
import {AddAuthorizationCookieInterceptorService} from './helpers/interceptors/add-authorization-cookie-interceptor.service';



@NgModule({
  declarations: [
    AppComponent,
    MaterialsComponent,
    CreateNewMaterialComponent,
    SortDirective,
    SearchDirective,
    UpdateMaterialComponent,
    LoginComponent,
    HeaderComponent,
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'add', component: CreateNewMaterialComponent
      },
      {path: 'materials', component: MaterialsComponent }])

  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: AddAuthorizationCookieInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
