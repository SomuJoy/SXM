import { createAction, props } from '@ngrx/store';
import { Settings } from './settings.interface';

export const appSettingsLoaded = createAction('[App Settings] App settings loaded', props<{ settings: Settings }>());
