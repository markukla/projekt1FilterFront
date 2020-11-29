import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UsersTableService} from '../../../Users/UserServices/users-table.service';
import {Observable} from 'rxjs';
import User from '../../../Users/users/userTypes/user';
import CreatePrivilegedUserDto from '../../../Users/users/userTypes/createUserDto';
import {tap} from 'rxjs/operators';
import UpdatePrivilegedUserWithouTPasswordDto from '../../../Users/users/userTypes/updatePriviligedUser';
import CHangePasswordByAdminDto from '../../../Users/users/userTypes/changePasswordDto';
import BlockUserDto from '../../../Users/users/userTypes/blockUseDto';

@Injectable({
  providedIn: 'root'
})
export class BusinesPartnerBackendService {

  rootURL = 'http://localhost:5000';

  constructor(private http: HttpClient,
              private usersTableService: UsersTableService
  ) {
  }

  getAllPriviligedUsers(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.rootURL + '/business_partners', {observe: 'response'});
  }
  // tslint:disable-next-line:typedef
  addUsers(createUser: CreatePrivilegedUserDto): Observable<HttpResponse<User>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<User>(this.rootURL + '/business_partners', createUser, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.usersTableService.addRecordToTable(user.body);
      }));
  }

  deleteUserlById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL}/business_partners/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.usersTableService.deleteRecordById(Number(id));
      }));
  }

  updateUserById(id: string, updateUserDto: UpdatePrivilegedUserWithouTPasswordDto): Observable<HttpResponse<User>> {
    const updateUrl = `${this.rootURL}/business_partners/${id}`;
    return this.http.patch<User>(updateUrl, updateUserDto, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.usersTableService.updateTableRecord(Number(id), user.body);

      }));
  }
  // tslint:disable-next-line:typedef


  findUserById(id: string): Observable<HttpResponse<User>> {
    const getUrl = `${this.rootURL}/business_partners/${id}`;
    return this.http.get<User>(getUrl, {observe: 'response'} );
  }

  findUserByEmail(email: string): Observable<boolean> {
    const getUrl = `${this.rootURL}/business_partners/emails/${email}`;
    return this.http.get<boolean>(getUrl);
  }
  changeUserPasswordById(id: string, passwordData: CHangePasswordByAdminDto): Observable<HttpResponse<User>> {
    const url = `${this.rootURL}/business_partners/${id}/changePassword`;
    return this.http.patch<User>(url, passwordData, { observe: 'response'} );
  }
  blodkUserById(id: string, activeData: BlockUserDto): Observable<HttpResponse<User>> {
    const url = `${this.rootURL}/business_partners/${id}/blockOrUnblock`;
    return this.http.patch<User>(url, activeData, { observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.usersTableService.updateTableRecord(Number(id), user.body);

      }));
  }
}
