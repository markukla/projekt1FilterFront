import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {OperationStatusServiceService} from "./operation-status-service.service";

@Component({
  selector: 'app-operation-status',
  templateUrl: './operation-status.component.html',
  styleUrls: ['./operation-status.component.css']
})
export class OperationStatusComponent implements OnInit {
  @Input()
  operationFailerStatusMessage: string;
  @Input()
  operationSuccessStatusMessage: string;

  constructor(public operationStatusService: OperationStatusServiceService) { }

  ngOnInit(): void {
  }
}
