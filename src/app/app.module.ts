import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialsComponent} from './materials/MaterialsMainComponent/materials.component';
import { CreateNewMaterialComponent } from './materials/create-new-material/create-new-material.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortDirective } from './helpers/directive/sort.directive';
import { MaterialSearchDirective } from './helpers/directive/ForMaterials/material-search.directive';
import {RouterModule} from '@angular/router';
import { UpdateMaterialComponent } from './materials/update-material/update-material.component';
import {MaterialBackendService} from './materials/MaterialServices/material-backend.service';
import {ValidateMaterialCodeUniqueService} from './materials/MaterialServices/validate-material-code-unique.service';
import {MaterialTableService} from './materials/MaterialServices/material-table.service';
import { LoginComponent } from './LoginandLogOut/login/loginComponent/login.component';
import { HeaderComponent } from './header/header/header.component';
import {AddAuthorizationCookieInterceptorService} from './helpers/interceptors/add-authorization-cookie-interceptor.service';
import { OrdersComponent } from './Orders/orders/orders.component';
import { ProductComponent } from './Products/ProductMainComponent/product/product.component';
import { ProductTopComponent } from './Products/ProductTop/product-top/product-top.component';
import { ProductBottomComponent } from './Products/ProductBottom/product-bottom/product-bottom.component';
import { UsersComponent } from './Users/UsersMainComponent/users.component';
import { BusinessPartnersComponent } from './BusinessPartners/business-partners/business-partners.component';
import { ProductTypeComponent } from './Products/ProductType/product-type/product-type.component';
import {ErrorsInterceptorService} from './helpers/interceptors/intercept-errors.service';
import { AdminSerchDirective } from './helpers/directive/ForUsers/admin-serch.directive';
import { EditorsSearchDirectiveDirective } from './helpers/directive/ForUsers/editors-search-directive.directive';
import { UpdateUserComponent } from './Users/update-user/update-user.component';
import { CreateNewUserComponent } from './Users/create-new-user/create-new-user.component';
import { ChangePasswordComponent } from './Users/change-password/change-password.component';



@NgModule({
  declarations: [
    AppComponent,
    MaterialsComponent,
    CreateNewMaterialComponent,
    SortDirective,
    MaterialSearchDirective,
    UpdateMaterialComponent,
    LoginComponent,
    HeaderComponent,
    OrdersComponent,
    ProductComponent,
    ProductTopComponent,
    ProductBottomComponent,
    UsersComponent,
    BusinessPartnersComponent,
    ProductTypeComponent,
    AdminSerchDirective,
    EditorsSearchDirectiveDirective,
    UpdateUserComponent,
    CreateNewUserComponent,
    ChangePasswordComponent,
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'orders', component: OrdersComponent},
      {path: 'materials', component: MaterialsComponent },
      { path: 'materials/add', component: CreateNewMaterialComponent},
      { path: 'materials/update', component: UpdateMaterialComponent},
      { path: 'users', component: UsersComponent},
      { path: 'users/add', component: CreateNewUserComponent},
      { path: 'businessPartners', component: BusinessPartnersComponent},
      { path: 'products', component: ProductComponent},
      { path: 'products/bottom', component: ProductBottomComponent},
      { path: 'products/top', component: ProductTopComponent},
      { path: 'products/productsTypes', component: ProductTopComponent},
      {path: 'login', component: LoginComponent }
      ])

  ],
  providers: [

    {provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AddAuthorizationCookieInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
