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
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import {OperationStatusServiceService} from '../../OperationStatusComponent/operation-status/operation-status-service.service';
import {
  generalNamesInSelectedLanguage,
  generalUserNames
} from '../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";

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
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  generalUserNames = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;



  constructor(public tableService: GeneralTableService,
              public backendService: UserBackendService,
              public authenticationService: AuthenticationService,
              public searChService: SearchService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              public statusService: OperationStatusServiceService) {
    this.admins = [];
    this.editors = [];
  }
  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
    this.getRecords();
    this.selectedId = this.tableService.selectedId;
    this.deleteButtonInfo = this.generalNamesInSelectedLanguage.deleteButtonInfo;
    this.updateButtonInfo = this.generalNamesInSelectedLanguage.updateButtonInfo;
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalUserNames, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
  }

  setBlockButtonActionInfoMessage(user: User): string{
   let blockButtonActionInfoMessage: string;
   if (user && user.active) {
       blockButtonActionInfoMessage = this.generalUserNames.blockUser;
    }
    else {
      blockButtonActionInfoMessage = this.generalUserNames.unblockUser;
    }
   return blockButtonActionInfoMessage;
  }

  setBlockButtonStatusMessage(user: User): string {
    let blockButtonStatusMessage: string;
    if (user && user.active) {
   blockButtonStatusMessage = this.generalUserNames.userStatusActive;
}
else {
    blockButtonStatusMessage = this.generalUserNames.userStatusBlocked;
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
    this.backendService.getAllPriviligedUsers().subscribe((users) => {
      this.tableService.records.length = 0;
      this.tableService.records = users.body;
      this.allPriviligedUsers = this.tableService.getRecords();
      this.updateAdminsTable();
      this.updateEditorsTable();
      this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
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

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = materialId;
  }
  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteUserlById(String(recordId)).subscribe((response) => {
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      }, error => {
        this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      });
    }
    else {
      this.showConfirmDeleteWindow = false;
    }
  }
  updateSelectedRecord(userId: number): void {
    this.tableService.selectedId = userId;
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
    this.backendService.blodkUserById(String(user.id), blockUserDto).subscribe((user) => {
      if (user.body.active) {
        this.operationStatusMessage = this.generalUserNames.userHasBeenUnblockedMessage;
      }
      else {
        this.operationStatusMessage = this.generalUserNames.userHasBennBlockedMessage;
      }
    });
  }
  changePaswordForUserId(id: number): void {
    this.tableService.selectedId = id;
    this.router.navigateByUrl('/users/changePassword');
  }

}
