import {Injectable, Input} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationStatusServiceService {
showOperationStatus = false;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  constructor() { }

  makeOperationStatusVisable(): void {
    this.showOperationStatus = true;
  }
  hideOperationStatus(): void {
    this.showOperationStatus = false;
  }

  resetOperationStatusAfterTimeout(statusMessages: string[]): void {
    setTimeout(() => {
      statusMessages.forEach((statusMessage) => {
        if (statusMessage) {
          statusMessage = null;
        }
      });
      this.hideOperationStatus();
    }, 5000);
  }
  resetOperationStatus(statusMessages: string[]): void {
      statusMessages.forEach((statusMessage) => {
        if (statusMessage) {
          statusMessage = null;
        }
      });
      this.hideOperationStatus();
  }
}


