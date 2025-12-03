import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const emailConfirmedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const queryParamMap = route.queryParamMap;
  const outOfBandCode = queryParamMap.get('oobCode');
  const mode = queryParamMap.get('mode');

  return combineLatest([authService.isLoggedIn$, authService.isEmailVerified$]).pipe(
    map(([isLoggedIn, isEmailVerified]) => {
      if (!isLoggedIn) {
        return router.createUrlTree(['/login']);
      }

      if (isEmailVerified) {
        return true;
      }

      const hasValidVerificationParams = Boolean(outOfBandCode && mode === 'verifyEmail');
      if (hasValidVerificationParams) {
        return true;
      }

      return router.createUrlTree(['/verify-email']);
    })
  );
};
