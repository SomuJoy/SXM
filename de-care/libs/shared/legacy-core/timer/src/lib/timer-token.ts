import { InjectionToken } from '@angular/core';
import { Timer } from './timer';

export const AppTimer = new InjectionToken<Timer>('timer');
