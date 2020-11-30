import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {UserBackendService} from '../UserServices/user-backend.service';
import {UserValidatorService} from '../UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersTableService} from '../UserServices/users-table.service';
import {UserHasAdminRole} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit, AfterContentChecked {
  operationStatusMessage: string;
  selectedId = String(this.userTableService.selectedId);

  constructor(
    private userBackendService: UserBackendService,
    private userTableService: UsersTableService,
    public userValidatorService: UserValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  userForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    fulName: new FormControl('', [Validators.nullValidator, Validators.required]),
    // tslint:disable-next-line:max-line-length
    email: new FormControl('', {
      updateOn: 'change',
      validators: [Validators.nullValidator, Validators.required, Validators.email],
      asyncValidators: [this.userValidatorService.emailAsyncValidatorForUpdate(this.selectedId)]
    }),
    active: new FormControl(false),
    // tslint:disable-next-line:max-line-length
    isAdmin: new FormControl(false),
  }, {updateOn: 'change'});

  // tslint:disable-next-line:typedef
  get fulName() {
    return this.userForm.get('fulName');
  }

  // tslint:disable-next-line:typedef
  get email() {
    return this.userForm.get('email');
  }

  // tslint:disable-next-line:typedef
  get active() {
    return this.userForm.get('active');
  }

  // tslint:disable-next-line:typedef
  get isAdmin() {
    return this.userForm.get('isAdmin');
  }

  setCurrentValueOfFormFields(): void {
    this.userBackendService.findUserById(this.selectedId).subscribe((user) => {
      const foundUser = user.body;
      this.fulName.setValue(user.body.fulName);
      this.email.setValue(user.body.email);
      this.active.setValue(user.body.active);
      if (UserHasAdminRole(foundUser)) {
        this.isAdmin.setValue(true);
      } else {
        this.isAdmin.setValue(false);
      }
    });

  }

  onSubmit(): void {
    this.userBackendService.updateUserById(this.selectedId, this.userForm.value).subscribe((user) => {
      this.operationStatusMessage = 'Zaktualizowano dane użytkownika';
      this.cleanOperationMessageAndGoBack();
    }, error => {
      this.operationStatusMessage = 'Wystąpił bląd, nie udało się zmienić danych użytownika';
      this.cleanOperationMessageAndGoBack();
    });
  }

  closeAndGoBack(): void {
    this.router.navigateByUrl('/users');
  }

  ngOnInit(): void {
    this.setCurrentValueOfFormFields();
  }

  cleanOperationMessageAndGoBack(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
      this.router.navigateByUrl('/users');
    }, 2000);
  }

  ngAfterContentChecked(): void {
  }


}
