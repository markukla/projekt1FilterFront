import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BackendMessageService {
  // tslint:disable-next-line:variable-name
  backendError: HttpErrorResponse;
  otherRecordAlreadyExist = 'Operacja dodawania/aktualizacji nie powiodła się, rekord który próbowałeś dodać już istnieję w bazie danych';
  generalErrorMessageForCreateOrUpdate = ' Wystąpił błąd: Dodawania/aktualizacja nie powiodły się, spróbuj ponownie';
  generalSuccessMessageForCreateOrUpdate = 'Dodano nowy rekord do bazy danych';

  constructor(private authenticationService: AuthenticationService) {
  }

  returnErrorToUserBasingOnBackendErrorString(error: HttpErrorResponse): string {
    const errorMessage = error.error.message;
    if (errorMessage.includes('already exist')) {
      return this.otherRecordAlreadyExist;
    } else {
      return this.generalErrorMessageForCreateOrUpdate;
    }
  }

  returnSuccessMessageToUserForSuccessBackendResponse(): string {
    return this.generalSuccessMessageForCreateOrUpdate;

  }

}
