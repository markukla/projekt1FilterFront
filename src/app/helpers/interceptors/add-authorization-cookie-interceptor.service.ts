import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AddAuthorizationCookieInterceptorService implements HttpInterceptor{

  constructor(private authencicationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('in intercept method');
    let newHeaders = req.headers;
    let loggedUser = this.authencicationService.loggedUser;
    let token = this.authencicationService.tokenString;
    let authReq: HttpRequest<any> = req;
    console.log(`token= ${token}`);
    if (loggedUser){
      console.log(`loged user Name ${loggedUser.user.fulName}`);
    }
    if (loggedUser && token){
      newHeaders.append('authtoken', token);
      console.log('token appended');
      authReq = req.clone({ setHeaders: { Authorization: token } });
    }
    return next.handle(authReq);
  }
}
