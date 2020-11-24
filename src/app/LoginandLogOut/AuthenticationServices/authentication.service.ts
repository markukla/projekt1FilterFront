import {Injectable} from '@angular/core';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';
import User from '../authenticationTypesAndClasses/user';
import TokenData from '../authenticationTypesAndClasses/tokenData';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
  }

  loggedUser: LoggedUser;
  user: User;
  tokenData: TokenData;
  tokenString: string;

  setLogedUserUserAndToken(loggedUser: LoggedUser): void {
    this.loggedUser = loggedUser;
    this.user = loggedUser.user;
    this.tokenData = loggedUser.tokenData;
    this.tokenString = loggedUser.tokenData.token;
  }

  getLogedUser(): LoggedUser {
    return this.loggedUser;
  }
}
