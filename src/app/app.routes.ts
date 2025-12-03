import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { MainContent } from './main-content/main-content';
import { SetProfilePicture } from './auth/set-profile-picture/set-profile-picture';
import { Login } from './auth/login/login';
import { VerifyEmail } from './auth/verify-email/verify-email';
import { EmailConfirmed } from './auth/email-confirmed/email-confirmed';
import { publicOrRedirectGuard } from './guards/public-or-redirect.guard';
import { onlyUnverifiedGuard } from './guards/only-unverified.guard';
import { onlyVerifiedGuard } from './guards/only-verified.guard';
import { emailConfirmedGuard } from './guards/email-confirmed.guard';
import { ResetPassword } from './auth/reset-password/reset-password';
import { AuthActionComponent } from './auth/auth-action/auth-action';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'auth-action',
    component: AuthActionComponent,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  },
  {
    path: 'login',
    component: Login,
    canMatch: [publicOrRedirectGuard],
  },
  {
    path: 'signup',
    component: Signup,
    canMatch: [publicOrRedirectGuard],
  },
  {
    path: 'set-profile-picture',
    component: SetProfilePicture,
    canMatch: [publicOrRedirectGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
    canMatch: [onlyUnverifiedGuard],
  },
  {
    path: 'email-confirmed',
    component: EmailConfirmed,
    canActivate: [emailConfirmedGuard],
  },
  {
    path: 'main',
    component: MainContent,
    canMatch: [onlyVerifiedGuard],
  },
];
