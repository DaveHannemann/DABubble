import { Component, inject } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { ProfileMenu } from '../profile-menu/profile-menu';

@Component({
  selector: 'app-navbar-dialog',
  imports: [],
  templateUrl: './navbar-dialog.html',
  styleUrl: './navbar-dialog.scss',
})
export class NavbarDialog {
  private overlayService = inject(OverlayService);
  originTarget!: HTMLElement;

  openProfileDialog(event: Event) {
    this.overlayService.open(ProfileMenu, {
      target: this.originTarget,
      offsetX: -380,
      offsetY: 10,
      backdropOpacity: 0.6,
      data: { originTarget: this.originTarget }
    });
  }
}
