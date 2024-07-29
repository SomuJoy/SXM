import { InjectionToken } from '@angular/core';
import { Settings } from './settings.interface';

export const AppSettings = new InjectionToken<Settings>('APP_SETTINGS');
export const APP_SETTINGS_KEY = 'appSettings';

export const ALLOW_ERROR_HANDLER_HEADER = 'X-Allow-Error-Handler';
export const CURRENCY_PIPE_ZERO_DECIMAL_NUMBER_FORMAT: string = '1.0-0';
export const CURRENCY_PIPE_OPTIONAL_DECIMAL_NUMBER_FORMAT: string = '1.0-2';
export const CURRENCY_PIPE_TWO_DECIMAL_NUMBER_FORMAT: string = '1.2-2';
/**
 * @deprecated Use LANGUAGE_CODES from @de-care/shared/translation instead
 */
export const LANGUAGE_CODES = {
    EN_CA: 'en-CA',
    FR_CA: 'fr-CA',
    EN_US: 'en-US',
    DEFAULT: {
        US: 'en-US',
        CA: 'en-CA'
    }
};
export const LOCAL_STORAGE_SETTINGS_OVERRIDE_FLAG_NAME = 'useOverrideSettings';
export const LOCAL_STORAGE_OVERRIDE_DATA_NAME = 'settings';
