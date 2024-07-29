import { InjectionToken } from '@angular/core';

export const AMAZON_CLIENT_ID = new InjectionToken<string>('amazonClientId', {
    providedIn: 'root',
    factory: () => '',
});
