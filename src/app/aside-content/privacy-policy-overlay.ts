import { Component, inject } from '@angular/core';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy-policy-overlay',
  imports: [PrivacyPolicy],
  template: `
    <app-privacy-policy [embedded]="true" [class.embedded]="true" (action)="onClose()"></app-privacy-policy>
  `,
})
export class PrivacyPolicyOverlay {
  private readonly dialogRef = inject(MatDialogRef<PrivacyPolicy>);

  onClose() {
    this.dialogRef.close();
  }
}
