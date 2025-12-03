import { Injectable, Type, inject, ApplicationRef, EnvironmentInjector } from '@angular/core';
import { OverlayRef, OverlayConfig } from '../classes/overlay.class';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private appRef = inject(ApplicationRef);
  private overlays: OverlayRef<object>[] = [];
  private envInjector = inject(EnvironmentInjector);

  open<T extends object>(component: Type<T>, config?: OverlayConfig<T>) {
    const overlayRef = new OverlayRef<T>(component, config, this.appRef, this.envInjector);

    this.overlays.push(overlayRef as OverlayRef<object>);

    overlayRef.onClose(() => {
      this.overlays = this.overlays.filter((o) => o !== overlayRef);
    });

    overlayRef.open();
    return overlayRef;
  }

  closeLast() {
    const last = this.overlays[this.overlays.length - 1];
    last?.close();
  }

  closeAll() {
    this.overlays.forEach((o) => o.close());
    this.overlays = [];
  }
}
