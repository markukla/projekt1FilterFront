import {AfterContentChecked, AfterViewChecked, Component, OnInit} from '@angular/core';
import RoleEnum from '../../Users/users/userTypes/roleEnum';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {NavigationEnd, NavigationStart, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterContentChecked, AfterViewChecked, OnInit {
  loggedUserRole: RoleEnum;
  admin: RoleEnum;
  editor: RoleEnum;
  partner: RoleEnum;
  private previousUrl: string;
  private currentUrl: string;
  constructor(public authenticationService: AuthenticationService,
              private router: Router) {
   // this.resetLoggedUserInAuthenticationService();
    this.editor = RoleEnum.EDITOR;
    this.partner = RoleEnum.PARTNER;
    this.admin = RoleEnum.ADMIN;
  }
  ngAfterContentChecked(): void {
    this.loggedUserRole = this.authenticationService.userRole;
  }

  resetLoggedUserInAuthenticationService(): void {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart && evt.url === '/login') {
        this.authenticationService.setLogedUserUserAndToken(null);
      }
    });
  }

  ngAfterViewChecked(): void {
  }

  ngOnInit(): void {
  }
  showHeaderIfNoDrawing(): boolean {
    if (this.authenticationService && this.authenticationService._currentUrl) {
      if (this.authenticationService._currentUrl.includes('orders/drawing')){
        return false;
      }
      else {
        return true;
      }
    }
  }
}
