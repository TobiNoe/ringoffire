import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ringoffire-2caba","appId":"1:812402739456:web:526f366eceee691e614be5","storageBucket":"ringoffire-2caba.appspot.com","apiKey":"AIzaSyCpqMm9yIL3oPP86FzJ1RCkkXrUhCz3KhU","authDomain":"ringoffire-2caba.firebaseapp.com","messagingSenderId":"812402739456"})), provideFirestore(() => getFirestore())]
};
