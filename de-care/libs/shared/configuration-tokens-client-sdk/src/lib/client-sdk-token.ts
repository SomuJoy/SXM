import { inject, InjectionToken } from '@angular/core';
import { ClientSDK, IClientSDK } from './client-sdk';

export const CLIENT_SDK_BASE_URL = new InjectionToken<string>('clientSdkBaseUrl', {
    providedIn: 'root',
    factory: () => '',
});

export const CLIENT_SDK = new InjectionToken<IClientSDK>('clientSdk', {
    providedIn: 'root',
    factory: () => {
        const baseUrl = inject(CLIENT_SDK_BASE_URL);
        // TODO: use actual ClientSDK instance here
        return new ClientSDK(baseUrl);
    },
});
