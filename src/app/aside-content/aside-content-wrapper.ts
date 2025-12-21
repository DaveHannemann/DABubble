import { Component, input } from '@angular/core';
import { Logo } from './logo';
import { RouterLink } from '@angular/router';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-aside-content-wrapper',
  standalone: true,
  imports: [Logo, RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #main>
      <main class="dab-page-card">
        <ng-content select="[card]"></ng-content>
      </main>
    </ng-template>

    @if (showCardSurroundings()) {
      <section class="max-width m-auto grid min-h-full grid-rows-[1fr_auto_1fr]">
        <header>
          <div class="flex h-full items-start justify-between px-8 pt-8 sm:px-12 sm:pt-12">
            <app-logo></app-logo>
            <ng-content select="[topRight]"></ng-content>
          </div>
        </header>

        <ng-container [ngTemplateOutlet]="main"></ng-container>

        <footer>
          <div class="flex h-full items-end justify-center px-8 pb-8 sm:px-12 sm:pb-12">
            <div class="flex justify-between gap-4">
              <a routerLink="/legal-notice" class="dab-anchor-on-bg">Impressum</a>
              <a routerLink="/privacy-policy" class="dab-anchor-on-bg">Datenschutz</a>
            </div>
          </div>
        </footer>
      </section>
    } @else {
      <ng-container [ngTemplateOutlet]="main"></ng-container>
    }
  `,
})
export class AsideContentWrapperComponent {
  /**
   * Set to false if the content is only the card, e.g. in an overlay for reauth.
   */
  showCardSurroundings = input(true);
}
