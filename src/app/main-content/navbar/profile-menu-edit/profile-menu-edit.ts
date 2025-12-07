import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { OverlayService } from '../../../services/overlay.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-menu-edit',
  imports: [MatIcon, CommonModule],
  templateUrl: './profile-menu-edit.html',
  styleUrl: './profile-menu-edit.scss',
  animations: [
    trigger('scaleAnimation', [
      transition(':leave', [animate('250ms ease-in', style({ transform: 'scale(0.8)', opacity: 0 }))]),
    ]),
  ],
})
export class ProfileMenuEdit {
  private overlayService = inject(OverlayService);
  visible = true;

  onAnimationDone(event: any) {
    if (!this.visible) {
      this.overlayService.closeLast();
    }
  }

  closeOverlay() {
    this.visible = false;
  }

  updateName() {
    console.log('Name updated');
  }
}
