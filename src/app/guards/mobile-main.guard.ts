import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ScreenService } from '../services/screen.service';

export const mobileMainGuard: CanMatchFn = () => {
  return inject(ScreenService).isTabletScreen();
};