import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import User from '../../../Users/users/userTypes/user';
import {UsersTableService} from '../../../Users/UserServices/users-table.service';
import {UserBackendService} from '../../../Users/UserServices/user-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  UserHasAdminRole,
  UserHasEditorRoleButIsNotAdmin
} from '../../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import BlockUserDto from '../../../Users/users/userTypes/blockUseDto';
import {BusinessPartnerTableService} from '../BusinessPartnerServices/business-partner-table.service';
import {BusinesPartnerBackendService} from '../BusinessPartnerServices/busines-partner-backend.service';
import {OperationStatusServiceService} from '../../../OperationStatusComponent/operation-status/operation-status-service.service';
import {
  generalNamesInSelectedLanguage,
  generalUserNames, orderNames
} from '../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from '../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';

@Component({
  selector: 'app-business-partners',
  templateUrl: './business-partners.component.html',
  styleUrls: ['./business-partners.component.css']
})
export class BusinessPartnersComponent implements OnInit, AfterContentChecked {
  @Input()
  partners: User[];
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
  userNamesInSelectedLanguage = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;


  constructor(public tableService: BusinessPartnerTableService,
              public backendService: BusinesPartnerBackendService,
              public statusService: OperationStatusServiceService,
              public authenticationService: AuthenticationService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
    this.getRecords();
    this.selectedId = this.tableService.selectedId;
    this.deleteButtonInfo = 'usuń';
    this.updateButtonInfo = 'modyfikuj dane';
  }

  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.userNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNames, this.authenticationService.vocabulariesInSelectedLanguage);
  }

  setBlockButtonActionInfoMessage(user: User): string {
    let blockButtonActionInfoMessage: string;
    if (user && user.active) {
      blockButtonActionInfoMessage = this.userNamesInSelectedLanguage.blockUser;
    } else {
      blockButtonActionInfoMessage = this.userNamesInSelectedLanguage.unblockUser;
    }
    return blockButtonActionInfoMessage;
  }

  setBlockButtonStatusMessage(user: User): string {
    let blockButtonStatusMessage: string;
    if (user && user.active) {
      blockButtonStatusMessage = this.userNamesInSelectedLanguage.userStatusActive;
    } else {
      blockButtonStatusMessage = this.userNamesInSelectedLanguage.userStatusBlocked;
    }
    return blockButtonStatusMessage;
  }

  ngAfterContentChecked(): void {
    if (this.partners) {
      this.recordNumbers = this.partners.length;
    }
  }

  getRecords(): void {
    this.backendService.getAllRecords().subscribe((users) => {
      this.tableService.tableRecords.length = 0;
      this.tableService.tableRecords = users.body;
      this.partners = this.tableService.getTableRecords();
    });

  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = materialId;
  }

  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteOneRecordById(String(recordId)).subscribe((response) => {
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
    } else {
      this.showConfirmDeleteWindow = false;
    }
  }

  updateSelectedRecord(userId: number): void {
    this.tableService.selectedId = userId;
    this.router.navigateByUrl('/businessPartners/update');
  }

  blockOrUnblockUser(user: User): void {
    let updatedActiveStatus: boolean;
    if (user.active) {
      /*if uset taken as input is active method set new avtive to false and oposite*/
      updatedActiveStatus = false;
    } else {
      updatedActiveStatus = true;
    }
    const blockUserDto: BlockUserDto = {
      active: updatedActiveStatus
    };
    // tslint:disable-next-line:no-shadowed-variable
    this.backendService.blodkUserById(String(user.id), blockUserDto).subscribe((user) => {
      if (user.body.active) {
        this.operationStatusMessage = this.userNamesInSelectedLanguage.userHasBeenUnblockedMessage;
      } else {
        this.operationStatusMessage = this.userNamesInSelectedLanguage.userHasBennBlockedMessage;
      }
    });
  }

  changePaswordForUserId(id: number): void {
    this.tableService.selectedId = id;
    this.router.navigateByUrl('/businessPartners/changePassword');
  }


  showOrders(id: number): void {
    this.tableService.selectedId = id;
    const partnerId = String(id);
    // this.backendService.findRecordById(String(id)).subscribe((partner) => {
    //  this.tableService.ordersOfBusinessPartner = partner.body.ordersOfPartner;

    // });
    this.router.navigateByUrl(`orders?patnerId=${partnerId}`);
  }

}
