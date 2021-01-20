import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {MaterialTableService} from '../../materials/MaterialServices/material-table.service';
import {Observable, throwError} from 'rxjs';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {tap} from 'rxjs/operators';
import User from '../users/userTypes/user';
import {UserHasAdminRole} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import {UsersTableService} from './users-table.service';
import {EditorsTableService} from './editors-table.service';
import CreatePrivilegedUserDto from '../users/userTypes/createUserDto';
import UpdatePrivilegedUserWithouTPasswordDto from '../users/userTypes/updatePriviligedUser';
import CHangePasswordByAdminDto from '../users/userTypes/changePasswordDto';
import BlockUserDto from '../users/userTypes/blockUseDto';
import {API_URL} from '../../Config/apiUrl';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';

@Injectable({
  providedIn: 'root'
})
export class UserBackendService {

  rootURL = API_URL;

  constructor(private http: HttpClient,
              private usersTableService: GeneralTableService
              ) {
  }

  getAllPriviligedUsers(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.rootURL + '/users', {observe: 'response'});
  }
  getAllAdmins(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.rootURL + '/users/admins', {observe: 'response'});
  }
  getAllEditors(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.rootURL + '/users/editors', {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addUsers(createUser: CreatePrivilegedUserDto): Observable<HttpResponse<User>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<User>(this.rootURL + '/users', createUser, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.usersTableService.addRecordToTable(user.body);
      }));
  }

  deleteUserlById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL}/users/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
      this.usersTableService.deleteRecordById(Number(id));
      }));
  }

  updateUserById(id: string, updateUserDto: UpdatePrivilegedUserWithouTPasswordDto): Observable<HttpResponse<User>> {
    const updateUrl = `${this.rootURL}/users/${id}`;
    return this.http.patch<User>(updateUrl, updateUserDto, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.usersTableService.updateTableRecord(Number(id), user.body);

      }));
  }
  // tslint:disable-next-line:typedef


  findUserById(id: string): Observable<HttpResponse<User>> {
    const getUrl = `${this.rootURL}/users/${id}`;
    return this.http.get<User>(getUrl, {observe: 'response'} );
  }

  findUserByEmail(email: string): Observable<boolean> {
    const getUrl = `${this.rootURL}/users/emails/${email}`;
    return this.http.get<boolean>(getUrl);
  }
  findOtherUserByEmail(email: string, id: string): Observable<boolean>{
    const getUrl = `${this.rootURL}/users/${id}/emails/${email}`;
    return this.http.get<boolean>(getUrl);
  }
  changeUserPasswordById(id: string, passwordData: CHangePasswordByAdminDto): Observable<HttpResponse<User>> {
    const url = `${this.rootURL}/users/${id}/changePassword`;
    return this.http.patch<User>(url, passwordData, { observe: 'response'} );
  }
  blodkUserById(id: string, activeData: BlockUserDto): Observable<HttpResponse<User>> {
    const url = `${this.rootURL}/users/${id}/blockOrUnblock`;
    return this.http.patch<User>(url, activeData, { observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.usersTableService.updateTableRecord(Number(id), user.body);

      }));
  }
}
