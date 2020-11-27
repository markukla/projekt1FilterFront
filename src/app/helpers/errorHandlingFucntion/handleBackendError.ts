import {HttpErrorResponse} from '@angular/common/http';

export function getBackendErrrorMesage(error: HttpErrorResponse): string {
  const message: string = error.error.message;
  return message;
}
