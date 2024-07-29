import { InjectionToken } from '@angular/core';
import { DeCareEnvironment } from './environment.interface';

export const DeCareEnvironmentToken = new InjectionToken<DeCareEnvironment>('de-care-environment-token');
