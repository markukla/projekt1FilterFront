import { Injectable } from '@angular/core';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import LogInDto from '../authenticationTypesAndClasses/login.dto';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';
import {API_URL} from '../../Config/apiUrl';

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
}
