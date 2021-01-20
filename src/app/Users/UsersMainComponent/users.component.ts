import {AfterContentChecked, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {MaterialTableService} from '../../materials/MaterialServices/material-table.service';
import {MaterialBackendService} from '../../materials/MaterialServices/material-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersTableService} from '../UserServices/users-table.service';
import {UserBackendService} from '../UserServices/user-backend.service';
import User from '../users/userTypes/user';
import {UserHasAdminRole, UserHasEditorRoleButIsNotAdmin} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import BlockUserDto from '../users/userTypes/blockUseDto';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterContentChecked {
  @Input()
  allPriviligedUsers: User[];
  admins: User[];
  editors: User[];
  @Input()
  deleTedMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  selectedId: number;
  recordNumbers: number;



  constructor(public userTableService: GeneralTableService,
              public userBackendService: UserBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
    this.admins = [];
    this.editors = [];
  }
  ngOnInit(): void {
    this.getRecords();
    this.selectedId = this.userTableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }

  setBlockButtonActionInfoMessage(user: User): string{
   let blockButtonActionInfoMessage: string;
   if (user && user.active) {
       blockButtonActionInfoMessage = 'Zablokuj';
    }
    else {
      blockButtonActionInfoMessage = 'Odblokuj';
    }
   return blockButtonActionInfoMessage;
  }

  setBlockButtonStatusMessage(user: User): string {
    let blockButtonStatusMessage: string;
    if (user && user.active) {
   blockButtonStatusMessage = 'Aktywny';
}
else {
    blockButtonStatusMessage = 'Zablokowany';
}
    return blockButtonStatusMessage;
  }

  ngAfterContentChecked(): void {
    if (this.allPriviligedUsers){
      this.recordNumbers = this.allPriviligedUsers.length;
    }
    if (this.allPriviligedUsers && this.admins){
      this.updateAdminsTable();
    }
    if (this.allPriviligedUsers && this.editors) {
      this.updateEditorsTable();
    }
  }
  getRecords(): void {
    this.userBackendService.getAllPriviligedUsers().subscribe((users) => {
      this.userTableService.records.length = 0;
      this.userTableService.records = users.body;
      this.allPriviligedUsers = this.userTableService.getRecords();
      this.updateAdminsTable();
      this.updateEditorsTable();
      console.log(`this admins= ${this.admins}`);
      if (this.admins){
      this.admins.forEach((admin) => {
        console.log(admin.fulName);
      });
      }
    });

  }
  updateAdminsTable(): void {
    this.admins.length = 0;
    this.allPriviligedUsers.forEach((user) => {
      if (UserHasAdminRole(user)){
        this.admins.push(user);
      }
    });
  }
  updateEditorsTable(): void {
    this.editors.length = 0;
    this.allPriviligedUsers.forEach((user) => {
      if (UserHasEditorRoleButIsNotAdmin(user)){
        this.editors.push(user);
      }
    });
  }

  deleteSelectedRecord(materialId: number): void {
    this.userBackendService.deleteUserlById(String(materialId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Materiał z bazy danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc materiału';
    });
  }

  updateSelectedRecord(userId: number): void {
    this.userTableService.selectedId = userId;
    this.router.navigateByUrl('/users/update');
  }
  blockOrUnblockUser(user: User): void {
    let updatedActiveStatus: boolean;
    if (user.active){
      /*if uset taken as input is active method set new avtive to false and oposite*/
      updatedActiveStatus = false;
    }
    else {
      updatedActiveStatus = true;
    }
    const blockUserDto: BlockUserDto = {
      active: updatedActiveStatus
    };
    // tslint:disable-next-line:no-shadowed-variable
    this.userBackendService.blodkUserById(String(user.id), blockUserDto).subscribe((user) => {
      if (user.body.active) {
        this.operationStatusMessage = 'uzytkownik został odblokowany';
      }
      else {
        this.operationStatusMessage = 'uzytkownik został zablokowany';
      }
    });
  }
  changePaswordForUserId(id: number): void {
    this.userTableService.selectedId = id;
    this.router.navigateByUrl('/users/changePassword');
  }

}
