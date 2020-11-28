import {AfterContentChecked, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Material} from '../../materials/MaterialsMainComponent/material';
import {MaterialTableService} from '../../materials/MaterialServices/material-table.service';
import {MaterialBackendService} from '../../materials/MaterialServices/material-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersTableService} from '../UserServices/users-table.service';
import {UserBackendService} from '../UserServices/user-backend.service';
import User from '../users/userTypes/user';
import {UserHasAdminRole, UserHasEditorRoleButIsNotAdmin} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';

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


  constructor(public userTableService: UsersTableService,
              public userBackendService: UserBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
    this.admins = [];
    this.editors = [];
  }
  ngOnInit(): void {
    this.getRecords();
    this.selectedId = this.userTableService.selectedId;
    this.deleteButtonInfo = 'delete Material';
    this.updateButtonInfo = 'update material';
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
      this.userTableService.tableRecords.length = 0;
      this.userTableService.tableRecords = users.body;
      this.allPriviligedUsers = this.userTableService.getTableRecords();
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

  updateSelectedRecord(materialId: number): void {
    this.userTableService.selectedId = materialId;
    this.router.navigateByUrl('/users/update');
  }

}
