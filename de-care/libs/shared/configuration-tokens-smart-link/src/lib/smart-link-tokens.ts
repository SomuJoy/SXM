import { InjectionToken } from '@angular/core';

export interface SmartLinkUrls {
    toPlayer: string;
    toPlayerAppForInstantStream: string;
}

export const SMART_LINK_URLS = new InjectionToken<SmartLinkUrls>('smartLinkUrls');
