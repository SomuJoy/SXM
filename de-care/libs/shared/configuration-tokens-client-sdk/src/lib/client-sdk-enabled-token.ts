import { InjectionToken } from '@angular/core';

export const CLIENT_SDK_ENABLED = new InjectionToken<boolean>('clientSdkEnabled', {
    providedIn: 'root',
    factory: () => false,
});
