import {Injectable} from '@angular/core';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';
import User from '../../Users/users/userTypes/user';
import TokenData from '../authenticationTypesAndClasses/tokenData';
import RoleEnum from '../../Users/users/userTypes/roleEnum';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';
import {Vocabulary} from '../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loggedUser: LoggedUser;
  user: User;
  tokenData: TokenData;
  tokenString: string;
  userRole: RoleEnum;
  selectedLanguageCode: string;
  languages: Language [];
  vocabularies: Vocabulary[];
  private previousUrl: string;
  private currentUrl: string;
  private routeHistory: string[];

  constructor(router: Router) {
    this.routeHistory = [];
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this._setURLs(event);
      });
  }
  private _setURLs(event: NavigationEnd): void {
    const tempUrl = this.currentUrl;
    this.previousUrl = tempUrl;
    this.currentUrl = event.urlAfterRedirects;
    this.routeHistory.push(event.urlAfterRedirects);
  }

  get _previousUrl(): string {
    return this.previousUrl;
  }

  get _currentUrl(): string {
    return this.currentUrl;
  }

  get _routeHistory(): string[] {
    return this.routeHistory;
  }
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
