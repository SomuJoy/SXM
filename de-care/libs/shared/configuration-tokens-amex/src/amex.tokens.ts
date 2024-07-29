import { InjectionToken } from '@angular/core';
import { AmexStaticParams } from './amex.types';

export const AMEX_PARAMS = new InjectionToken<AmexStaticParams>('amexParams', {
    providedIn: 'root',
    factory: () => ({ mode: 'production', merchantApiKey: '', authRedirectUrl: '' }),
});
