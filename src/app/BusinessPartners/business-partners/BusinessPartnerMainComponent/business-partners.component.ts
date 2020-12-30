import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import User from '../../../Users/users/userTypes/user';
import {UsersTableService} from '../../../Users/UserServices/users-table.service';
import {UserBackendService} from '../../../Users/UserServices/user-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserHasAdminRole, UserHasEditorRoleButIsNotAdmin} from '../../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import BlockUserDto from '../../../Users/users/userTypes/blockUseDto';
import {BusinessPartnerTableService} from '../BusinessPartnerServices/business-partner-table.service';
import {BusinesPartnerBackendService} from '../BusinessPartnerServices/busines-partner-backend.service';

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



  constructor(public tableService: BusinessPartnerTableService,
              public backendService: BusinesPartnerBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.getRecords();
    this.selectedId = this.tableService.selectedId;
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
    if (this.partners){
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

  deleteSelectedRecord(materialId: number): void {
    this.backendService.deleteOneRecordById(String(materialId)).subscribe((response) => {
      this.operationStatusMessage = 'Usunięto Partnera Biznesowego z bazy Danych';
    }, error => {
      this.operationStatusMessage = 'Wystąpił bład, nie udało się usunąc Parntera Biznesowego';
    });
  }

  updateSelectedRecord(userId: number): void {
    this.tableService.selectedId = userId;
    this.router.navigateByUrl('/businessPartners/update');
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
        this.operationStatusMessage = 'uzytkownik został odblokowany';
      }
      else {
        this.operationStatusMessage = 'uzytkownik został zablokowany';
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
