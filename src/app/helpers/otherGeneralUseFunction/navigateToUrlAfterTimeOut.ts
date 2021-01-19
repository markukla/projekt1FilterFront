import {Router} from '@angular/router';

export const navigateToUrlAfterTimout =  (url: string, router: Router, timeout: number): void => {
  setTimeout(async () => {
   await router.navigateByUrl(`/${url}`);
  }, timeout);
};
