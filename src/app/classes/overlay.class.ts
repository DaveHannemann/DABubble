import {
  Type,
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';

export interface OverlayConfig<T = any> {
  target?: HTMLElement;
  backdropOpacity?: number;
  data?: Partial<T>;
  offsetX?: number;
  offsetY?: number;
}

export class OverlayRef<T extends object = any> {
  private componentRef!: ComponentRef<T>;
  private overlayContainer!: HTMLElement;
  private backdrop!: HTMLElement;

  constructor(
    private component: Type<T>,
    private config: OverlayConfig<T> = {},
    private appRef: ApplicationRef,
    private envInjector: EnvironmentInjector
  ) {}

  open() {
    this.backdrop = document.createElement('div');
    Object.assign(this.backdrop.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: `rgba(0,0,0,${this.config.backdropOpacity ?? 0.4})`,
      zIndex: '999'
    });
    document.body.appendChild(this.backdrop);

    this.overlayContainer = document.createElement('div');
    Object.assign(this.overlayContainer.style, {
      position: 'fixed',
      zIndex: '1000'
    });
    document.body.appendChild(this.overlayContainer);

    this.componentRef = createComponent(this.component, {
      environmentInjector: this.envInjector,
    });

    if (this.config.data) {
      Object.assign(this.componentRef.instance as any, this.config.data);
    }

    this.appRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    this.overlayContainer.appendChild(domElem);

    this.updatePosition();

    // Correct bindings
    this.backdrop.addEventListener('click', this.close);
    this._updateBound = this.updatePosition.bind(this);

    window.addEventListener('resize', this._updateBound);
    window.addEventListener('scroll', this._updateBound);
  }

  private _updateBound!: () => void;

  private updatePosition() {
    if (!this.config.target) return;

    const rect = this.config.target.getBoundingClientRect();
    const offsetX = this.config.offsetX ?? 0;
    const offsetY = this.config.offsetY ?? 0;

    this.overlayContainer.style.left = rect.left + offsetX + 'px';
    this.overlayContainer.style.top = rect.bottom + offsetY + 'px';
  }

  close = () => {
    this.backdrop.removeEventListener('click', this.close);
    window.removeEventListener('resize', this._updateBound);
    window.removeEventListener('scroll', this._updateBound);

    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();

    this.overlayContainer.remove();
    this.backdrop.remove();

    this.onCloseCallback?.();
  };

  private onCloseCallback?: () => void;
  onClose(cb: () => void) {
    this.onCloseCallback = cb;
  }
}
