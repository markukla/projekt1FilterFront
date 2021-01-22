import {Injectable} from '@angular/core';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';
import User from '../../Users/users/userTypes/user';
import TokenData from '../authenticationTypesAndClasses/tokenData';
import RoleEnum from '../../Users/users/userTypes/roleEnum';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';

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
  userRole: RoleEnum;
  selectedLanguageCode: string;
  languages: Language [];

  setLogedUserUserAndToken(loggedUser: LoggedUser): void {
    this.loggedUser = loggedUser;
    if (loggedUser) {
      this.user = loggedUser.user;
      this.tokenData = loggedUser.tokenData;
      this.tokenString = loggedUser.tokenData.token;
      this.setUserRole();
    }
    else {
      this.user = undefined;
      this.tokenData = undefined;
      this.tokenString = undefined;
      this.userRole = undefined;
    }
  }

  getLogedUser(): LoggedUser {
    return this.loggedUser;
  }
  setUserRole(): void {
    if (this.UserHasAdminRole(this.user)){
      this.userRole = RoleEnum.ADMIN;
    }
    if (this.UserHasEditorRoleButIsNotAdmin(this.user)) {
      this.userRole = RoleEnum.EDITOR;
    }
    if (this.UserHasPartnerRole(this.user)) {
      this.userRole = RoleEnum.PARTNER;
    }
  }
  public UserHasAdminRole = (user: User): boolean => {
    let isAdmin = false;

    user.roles.forEach(role => {
      if (role.rolename === RoleEnum.ADMIN) {
        isAdmin = true;

      }
    });


    return isAdmin;

  }
  public UserHasEditorRoleButIsNotAdmin = (user: User): boolean => {
    let isEditorButNotAdmin = false;
    let isAdmin = false;
    let isEditor = false;
    user.roles.forEach(role => {
      if (role.rolename === RoleEnum.ADMIN) {
        isAdmin = true;

      }
      if (role.rolename === RoleEnum.EDITOR) {
        isEditor = true;

      }
    });
    if (isEditor && !isAdmin) {
      isEditorButNotAdmin = true;
    }


    return isEditorButNotAdmin;

  }
  public UserHasPartnerRole = (user: User): boolean => {
    let isPartner = false;

    user.roles.forEach(role => {
      if (role.rolename === RoleEnum.PARTNER) {
        isPartner = true;

      }
    });


    return isPartner;

  }
}
