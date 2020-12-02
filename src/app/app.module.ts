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
import { BusinessPartnersComponent } from './BusinessPartners/business-partners/BusinessPartnerMainComponent/business-partners.component';
import { ProductTypeComponent } from './Products/ProductType/product-type/product-type.component';
import {ErrorsInterceptorService} from './helpers/interceptors/intercept-errors.service';
import { AdminSerchDirective } from './helpers/directive/ForUsers/admin-serch.directive';
import { EditorsSearchDirectiveDirective } from './helpers/directive/ForUsers/editors-search-directive.directive';
import { UpdateUserComponent } from './Users/update-user/update-user.component';
import { CreateNewUserComponent } from './Users/create-new-user/create-new-user.component';
import { ChangePasswordComponent } from './Users/change-password/change-password.component';
import { BusinessPartnerChangePasswordComponent } from './BusinessPartners/business-partners/ChangePassword/business-partner-change-password/business-partner-change-password.component';
import { CreateBusinesPartnerComponent } from './BusinessPartners/business-partners/CreateBusinessPartner/create-busines-partner/create-busines-partner.component';
import { UpdateBusinessPartnerComponent } from './BusinessPartners/business-partners/UpdateBusinessPartner/update-business-partner/update-business-partner.component';
import { PartersSearchDirective } from './helpers/directive/ForPartners/parters-search.directive';
import { CreateProductTopComponent } from './Products/ProductTop/create-product-top/create-product-top.component';
import { UpdateProductTopComponent } from './Products/ProductTop/update-product-top/update-product-top.component';
import { ProductTopSearchDirective } from './helpers/directive/ForProductTop/product-top-search.directive';



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
    BusinessPartnerChangePasswordComponent,
    CreateBusinesPartnerComponent,
    UpdateBusinessPartnerComponent,
    PartersSearchDirective,
    CreateProductTopComponent,
    UpdateProductTopComponent,
    ProductTopSearchDirective,
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
      { path: 'users/update', component: UpdateUserComponent},
      { path: 'users/changePassword', component: ChangePasswordComponent},
      { path: 'businessPartners', component: BusinessPartnersComponent},
      { path: 'businessPartners/add', component: CreateBusinesPartnerComponent},
      { path: 'businessPartners/update', component: UpdateBusinessPartnerComponent},
      { path: 'businessPartners/changePassword', component: BusinessPartnerChangePasswordComponent},
      { path: 'products', component: ProductComponent},
      { path: 'products/bottom', component: ProductBottomComponent},
      { path: 'products/tops', component: ProductTopComponent},
      { path: 'products/tops/add', component: ProductTopComponent},
      { path: 'products/tops/update', component: ProductTopComponent},
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
