import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Logo } from '../aside-content/logo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-startscreen',
  imports: [Logo, CommonModule],
  templateUrl: './startscreen.html',
  styleUrl: './startscreen.scss',
  animations: [
    trigger('logoMove', [
      state('center', style({ transform: 'translate(60px, 0) scale(2)' })),
      state('textIn', style({ transform: 'translate(-20px, 0) scale(2)' })),
      state('move', style({ transform: '{{ transform }}' }), { params: { transform: 'translate(0,0) scale(1)' } }),

      transition('center => textIn', animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)')),

      transition('textIn => move', animate('700ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),

    trigger('textSlide', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-50px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('1200ms 300ms ease-out')),
    ]),

    trigger('fadeOut', [
      state(
        'visible',
        style({
          opacity: 1,
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
        })
      ),
      transition('visible => hidden', animate('1200ms ease-in-out', style({ opacity: 0 }))),
    ]),
  ],
})
export class Startscreen implements AfterViewInit {
  @ViewChild('splashWrapper', { read: ElementRef })
  splashWrapper!: ElementRef<HTMLElement>;

  @ViewChild('targetLogo', { read: ElementRef })
  targetLogo!: ElementRef<HTMLElement>;

  private router = inject(Router);

  logoState: 'center' | 'textIn' | 'move' = 'center';
  logoTransform = '';
  showText = false;
  fadeState: 'visible' | 'hidden' = 'visible';
  textColorClass = 'text-white';

  ngAfterViewInit() {
    // show text
    setTimeout(() => {
      this.logoState = 'textIn';
    }, 500);

    setTimeout(() => {
      this.showText = true;
    }, 1000);

    // moving logo
    setTimeout(() => {
      const splashRect = this.splashWrapper.nativeElement.getBoundingClientRect();
      const targetRect = this.targetLogo.nativeElement.getBoundingClientRect();

      const translateX = targetRect.left - splashRect.left;
      const translateY = targetRect.top - splashRect.top;

      this.logoTransform = `translate(${translateX}px, ${translateY}px) scale(1)`;
      this.logoState = 'move';
    }, 2600);

    // fade before end
    setTimeout(() => {
      this.fadeState = 'hidden';
    }, 2600);

    setTimeout(() => {
      this.textColorClass = 'text-black';
    }, 2900);

    // routing while fading out
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3200);
  }
}
