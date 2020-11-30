import { Component, OnInit } from '@angular/core';
import {UserBackendService} from '../../../../Users/UserServices/user-backend.service';
import {UsersTableService} from '../../../../Users/UserServices/users-table.service';
import {UserValidatorService} from '../../../../Users/UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import CHangePasswordByAdminDto from '../../../../Users/users/userTypes/changePasswordDto';
import {UserHasAdminRole} from '../../../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import {BusinesPartnerBackendService} from '../../BusinessPartnerServices/busines-partner-backend.service';
import {BusinessPartnerTableService} from '../../BusinessPartnerServices/business-partner-table.service';
import {BusinessPartnerValidatorService} from '../../BusinessPartnerServices/business-partner-validator.service';

@Component({
  selector: 'app-business-partner-change-password',
  templateUrl: './business-partner-change-password.component.html',
  styleUrls: ['./business-partner-change-password.component.css']
})
export class BusinessPartnerChangePasswordComponent implements OnInit {

  operationStatusMessage: string;
  selectedId: string;

  constructor(
    private backendService: BusinesPartnerBackendService,
    private tableService: BusinessPartnerTableService,
    public validatorService: BusinessPartnerValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.selectedId = String(this.tableService.selectedId);

  }

  // @ts-ignore
  userForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.validatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.validatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.validatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, {updateOn: 'change', validators: [this.validatorService.passwordMatchValidator({NoPassswordMatch: true})]});

  // tslint:disable-next-line:typedef
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  // tslint:disable-next-line:typedef
  userFulname: string;
  userEmail: string;
  userStatus: string;
  // tslint:disable-next-line:typedef
  get password() {
    return this.userForm.get('password');
  }
  onSubmit(): void {
    const changePasswordData: CHangePasswordByAdminDto = {newPassword: this.password.value};
    this.backendService.changeUserPasswordById(this.selectedId, changePasswordData).subscribe((user) => {
      this.operationStatusMessage = 'Hasło zostało zmienione';
      this.cleanOperationMessage();
    }, error => {
      this.operationStatusMessage = 'Wystąpił bląd, nie udało się zmienić hasła';
      this.cleanOperationMessage();
    });
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/users');
  }

  ngOnInit(): void {
    this.getSelectedUserData();
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
    }, 2000);
  }
  getSelectedUserData(): void {
    this.backendService.findRecordById(this.selectedId).subscribe((user) => {
      if (user.body) {
        this.userFulname = user.body.fulName;
        this.userEmail = user.body.email;
        if (UserHasAdminRole(user.body)) {
          this.userStatus = 'Administrator';
        }
        else {
          this.userStatus = 'Edytor';
        }
      }
    });
  }


}