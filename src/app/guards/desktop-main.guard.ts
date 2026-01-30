import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ScreenService } from '../services/screen.service';

export const desktopMainGuard: CanMatchFn = () => {
  return !inject(ScreenService).isTabletScreen();
};