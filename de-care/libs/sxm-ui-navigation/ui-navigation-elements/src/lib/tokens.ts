import { InjectionToken } from '@angular/core';

export interface NavigationElementsBaseUrls {
    oacUrl: string;
    careUrl: string;
    dotComUrl: string;
}

export const NAVIGATION_ELEMENTS_BASE_URLS = new InjectionToken<NavigationElementsBaseUrls>('navigationElementsBaseUrls');
