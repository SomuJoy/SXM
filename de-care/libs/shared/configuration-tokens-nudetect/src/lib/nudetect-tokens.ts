import { InjectionToken } from '@angular/core';

export interface NuDetectSettings {
    ndClientId: string;
    ndClientEnabled: boolean;
}
export const NU_DETECT_SETTINGS = new InjectionToken<NuDetectSettings>('nuDetectSettings');
