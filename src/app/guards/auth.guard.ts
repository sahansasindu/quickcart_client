import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CookieManagerService } from '../services/cookie-manager.service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieManagerService);
  const router = inject(Router);

  if (cookieService.tokenIsExists('access_token')) {
    return true;
  } else {
    router.navigate(['/security/context/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
