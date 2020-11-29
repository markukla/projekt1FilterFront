import { Component, OnInit } from '@angular/core';
import {UserBackendService} from '../UserServices/user-backend.service';
import {UserValidatorService} from '../UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersTableService} from '../UserServices/users-table.service';
import CHangePasswordByAdminDto from '../users/userTypes/changePasswordDto';
import {UserHasAdminRole} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  operationStatusMessage: string;
  selectedId: string;

  constructor(
    private userBackendService: UserBackendService,
    private userTableService: UsersTableService,
    public userValidatorService: UserValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.selectedId = String(this.userTableService.selectedId);

  }

  // @ts-ignore
  userForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.userValidatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.userValidatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.userValidatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, {updateOn: 'change', validators: [this.userValidatorService.passwordMatchValidator({NoPassswordMatch: true})]});

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
    this.userBackendService.changeUserPasswordById(this.selectedId, changePasswordData).subscribe((user) => {
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
    this.userBackendService.findUserById(this.selectedId).subscribe((user) => {
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
