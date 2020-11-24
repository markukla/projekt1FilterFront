import { Injectable } from '@angular/core';
import {Material} from '../../materials/material';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import LogInDto from '../authenticationTypesAndClasses/login.dto';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationBackendService {

  constructor(private http: HttpClient) { }
  login(loginDto: LogInDto): Observable<HttpResponse<LoggedUser>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<LoggedUser>('http://localhost:5000/auth/login', loginDto, {observe: 'response'})/*.pipe(catchError(this.handleError))*/;
  }
}
