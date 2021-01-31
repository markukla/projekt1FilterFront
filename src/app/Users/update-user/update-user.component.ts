import {AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {UserBackendService} from '../UserServices/user-backend.service';
import {UserValidatorService} from '../UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersTableService} from '../UserServices/users-table.service';
import {UserHasAdminRole} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import User from '../users/userTypes/user';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit, AfterContentChecked, AfterViewInit {
  operationStatusMessage: string;
  selectedId = String(this.userTableService.selectedId);
  admin: string;
  editor: string;
  userToUpdate: User;
  @ViewChild('selectStatus', {read: ElementRef}) selectStatusElement: ElementRef;
  @ViewChildren('optionForSelectStatus', {read: ElementRef}) optionsForSelectStatus: ElementRef[];

  constructor(
    private authenticationService: AuthenticationService,
    private userBackendService: UserBackendService,
    private userTableService: GeneralTableService,
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
      this.userToUpdate = foundUser;
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
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }

  ngOnInit(): void {
    this.initNamesForSelectedLanguage();
    this.setCurrentValueOfFormFields();
  }

  initNamesForSelectedLanguage(): void {
    this.admin = 'Administator';
    this.editor = 'Edytor';
  }

  cleanOperationMessageAndGoBack(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
      this.router.navigateByUrl(this.authenticationService._previousUrl);
    }, 2000);
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
    this.setSelectStatusValuForCHosenUser();
  }

  setSelectStatusValuForCHosenUser(): void {
    let adminOption: HTMLOptionElement;
    let editorOption: HTMLOptionElement;
    this.optionsForSelectStatus.forEach((option) => {
      if (option.nativeElement.id === 'admin') {
        adminOption = option.nativeElement;
      } else if (option.nativeElement.id === 'editor') {
        editorOption = option.nativeElement;
      }
    });
    if (this.isAdmin.value === true) {
      this.selectStatusElement.nativeElement.setValue(adminOption.value);
    } else if (this.isAdmin.value === false) {
      this.selectStatusElement.nativeElement.setValue(editorOption.value);
    }
  }

}
