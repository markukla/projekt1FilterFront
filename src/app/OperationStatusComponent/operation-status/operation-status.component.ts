import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-operation-status',
  templateUrl: './operation-status.component.html',
  styleUrls: ['./operation-status.component.css']
})
export class OperationStatusComponent implements OnInit,AfterContentChecked {
  @Input()
  operationFailerStatusMessage: string;
  @Input()
  operationSuccessStatusMessage: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.resetOperationStatusAfterTimeout();
  }
  resetOperationStatusAfterTimeout(): void {
    setTimeout(() => {
      if (this.operationSuccessStatusMessage){
        this.operationSuccessStatusMessage = null;
      }
      if (this.operationFailerStatusMessage) {
        this.operationFailerStatusMessage = null;
      }
    }, 3000);
  }

}
