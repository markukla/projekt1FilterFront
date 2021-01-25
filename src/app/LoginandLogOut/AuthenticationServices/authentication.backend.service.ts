import { Injectable } from '@angular/core';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import LogInDto from '../authenticationTypesAndClasses/login.dto';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';
import {API_URL} from '../../Config/apiUrl';
import {ChangePasswordDto} from './changePasswordDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationBackendService {
rootUrl = API_URL;
  constructor(private http: HttpClient) { }
  login(loginDto: LogInDto): Observable<HttpResponse<LoggedUser>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<LoggedUser>(this.rootUrl + '/auth/login', loginDto, {observe: 'response'})/*.pipe(catchError(this.handleError))*/;
  }
  logout(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.rootUrl + '/auth/logout')/*.pipe(catchError(this.handleError))*/;
  }
  changePasswordByLoggedUser(changePasswordDto: ChangePasswordDto): Observable<HttpResponse<any>> {
    // tslint:disable-next-line:max-line-length
    return this.http.patch<any>(this.rootUrl + '/auth/changePassword', changePasswordDto, {observe: 'response'})/*.pipe(catchError(this.handleError))*/;
  }
}
