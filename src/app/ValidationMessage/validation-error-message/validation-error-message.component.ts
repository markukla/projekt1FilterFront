import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-validation-error-message',
  templateUrl: './validation-error-message.component.html',
  styleUrls: ['./validation-error-message.component.css']
})
export class ValidationErrorMessageComponent implements OnInit {
  @Input()
  userInputErrorsMessages: string[];
  @Output()
  confirmButtonClickedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  confirmButtonAction(): void {
    this.confirmButtonClickedEvent.emit(true);
  }

}
