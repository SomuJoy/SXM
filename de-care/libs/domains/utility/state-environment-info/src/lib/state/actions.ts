import { createAction, props } from '@ngrx/store';
import { EnvironmentInfoModel } from '../data-services/environment-info.interface';

export const loadEnvironmentInfoError = createAction('[Utility] Error loading environment info', props<{ error: any }>());
export const setEnvironmentInfo = createAction('[Utility] Set environment info', props<{ environmentInfo: EnvironmentInfoModel }>());
