import { InjectionToken } from '@angular/core';

export interface IdentityParameters {
    atok?: string;
    dtok?: string;
    radioid?: string;
    act?: string;
}

export const IDENTITY_PARAMETERS = new InjectionToken<IdentityParameters>('identityParameters');
