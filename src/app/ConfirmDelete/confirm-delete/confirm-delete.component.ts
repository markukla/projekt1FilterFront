import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmDeleteServiceService} from "../confirm-delete-service.service";

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {
  @Input()
  showConfirmDeleteWindow: boolean;
  confirmDeleteDescritpion: string;
  confirmDeleteButtonDescription: string;
  resignFromDeletingButtonDescription: string;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  @Output() deleteConfirmedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
  ) { }

  ngOnInit(): void {
    this.confirmDeleteButtonDescription = 'Tak';
    this.confirmDeleteDescritpion = 'Czy na pewno chcesz usunać wybrany element ?';
    this.resignFromDeletingButtonDescription = 'Nie';
    this.operationFailerStatusMessage = 'Nie udało się usunąć wybranego elementu';
    this.operationSuccessStatusMessage = 'Usunięto wybrany element';
  }

  confirmDeleteButtonAction(): void {
    this.showConfirmDeleteWindow = false;
    this.deleteConfirmedEvent.emit(true);
  }

  resignFromDeletingButtonAction(): void {
    this.showConfirmDeleteWindow = false;
    this.deleteConfirmedEvent.emit(false);
  }
}
