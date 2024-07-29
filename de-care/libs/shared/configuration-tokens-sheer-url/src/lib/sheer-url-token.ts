import { InjectionToken } from '@angular/core';

export interface SheerIdWidgetUrls {
    sheerIdIdentificationWidgetUrl: string;
    sheerIdIdentificationReVerificationWidgetUrl: string;
}

export const SHEER_ID_WIDGET_URLS = new InjectionToken<SheerIdWidgetUrls>('sheerIdWidgetUrl');
