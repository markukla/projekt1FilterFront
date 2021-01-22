import {Component, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'projekt1FilterFront';
  route: string;
  ngOnInit(): void {
    this.route = window.location.href;
  }
  showHeader(): boolean{
    if (this.route.includes('drawing')) {
      return false;
    }
    else {
      return true;
    }
  }
}
