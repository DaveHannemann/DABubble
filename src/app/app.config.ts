import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, ViewTransitionInfo, ViewTransitionsFeatureOptions, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ViewTransitionService } from './services/view-transition.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(getViewTransitionOptions())),
    /** TODO for Angular v23: remove provideAnimations() and migrate animations */
    provideAnimations(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-54e45',
        appId: '1:540944892197:web:3e473ff16df4b9458a9acc',
        storageBucket: 'dabubble-54e45.firebasestorage.app',
        apiKey: 'AIzaSyD0bQj9X-5G_3a0-2Q6uHjlsgEESE0InYA',
        authDomain: 'dabubble-54e45.firebaseapp.com',
        messagingSenderId: '540944892197',
        measurementId: 'G-JCXSMQS4S6',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};

function getViewTransitionOptions(): ViewTransitionsFeatureOptions {
  return {
    skipInitialTransition: true,
    onViewTransitionCreated: (transitionInfo: ViewTransitionInfo) => {
      const viewTransitionService = inject(ViewTransitionService);
      viewTransitionService.handleViewTransition(transitionInfo);

      // Suppress "Transition was skipped" errors from console
      transitionInfo.transition.finished.catch((error) => {
        if (error?.name === 'AbortError' && error?.message?.includes('skipped')) {
          // Silently ignore - this is expected behavior
          return;
        }
        // Re-throw other errors
        throw error;
      });
    },
  };
}
