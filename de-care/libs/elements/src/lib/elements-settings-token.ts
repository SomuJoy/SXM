import { InjectionToken } from '@angular/core';

export interface ElementsSettings {
    rflzSuccessUrl: string;
    rflzNotEligibleStreamingUrl: string;
    flepzSuccessUrl: string;
    nouvRtpUrl: string;
    promocodeValidationBaseRedirectUrl: string;
    promocodeValidationBaseAccordionRedirectUrl: string;
    rflzErrorCodeStreamingRedirectUrl: string;
    rflzErrorCodeFlepzRedirectUrl: string;
    streamingFlepzSuccessUrl: string;
}

export const ElementsSettingsToken = new InjectionToken<ElementsSettings>('ELEMENTS_SETTINGS');

export const ELEMENTS_SETTINGS_KEY = 'elementsSettings';
export const LOCAL_STORAGE_ELEMENTS_SETTINGS_OVERRIDE_FLAG_NAME = 'useOverrideElementsSettings';
export const LOCAL_STORAGE_ELEMENTS_SETTINGS_OVERRIDE_DATA_NAME = 'elementsSettings';
