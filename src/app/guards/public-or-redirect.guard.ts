import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const publicOrRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.isLoggedIn$, authService.isEmailVerified$]).pipe(
    map(([isLoggedIn, isEmailVerified]) => {
      if (!isLoggedIn) {
        return true;
      }

      // E-Mail-Verifizierung deaktiviert - User wird direkt zu /main weitergeleitet
      return router.createUrlTree(['/main']);
    })
  );
};
