import { registerLocaleData } from '@angular/common';
import localeEnCa from '@angular/common/locales/en-CA';
import localeEnCaExtra from '@angular/common/locales/extra/en-CA';
import localeFrCaExtra from '@angular/common/locales/extra/fr-CA';
import localeFrCa from '@angular/common/locales/fr-CA';
import { APP_INITIALIZER, InjectionToken } from '@angular/core';
import { CoreLoggerService, DataLayerService, SharedEventTrackService } from '@de-care/data-layer';
import { DataIdentityRequestStoreService, DataValidationService } from '@de-care/data-services';
import { LANGUAGE_CODES } from '@de-care/settings';
import { BinRangesToken } from '@de-care/shared/validation';
import { Store } from '@ngrx/store';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';

const LANG_TOKEN = new InjectionToken<string>('langToken');

export function translateInitFactory(translateService: TranslateService, lang: string) {
    return () => {
        //register locales for currencyPipe
        registerLocaleData(localeFrCa, localeFrCaExtra);
        registerLocaleData(localeEnCa, localeEnCaExtra);
        translateService.setDefaultLang(LANGUAGE_CODES.DEFAULT.US);
        translateService.use(lang);
    };
}

export const TRANSLATE_PROVIDERS = [
    TranslateStore,
    {
        provide: LANG_TOKEN,
        useValue: LANGUAGE_CODES.DEFAULT.US,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: translateInitFactory,
        deps: [TranslateService, LANG_TOKEN],
        multi: true,
    },
];

export const TRANSLATE_PROVIDERS_CA = [
    TranslateStore,
    {
        provide: LANG_TOKEN,
        useValue: LANGUAGE_CODES.EN_CA,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: translateInitFactory,
        deps: [TranslateService, LANG_TOKEN],
        multi: true,
    },
];

export const TRANSLATE_PROVIDERS_CA_FR = [
    TranslateStore,
    {
        provide: LANG_TOKEN,
        useValue: LANGUAGE_CODES.FR_CA,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: translateInitFactory,
        deps: [TranslateService, LANG_TOKEN],
        multi: true,
    },
];

export const MOCK_DATA_VALIDATION_PROVIDER = {
    provide: DataValidationService,
    useValue: {
        validateCustomerInfo: () => of({ emailValidation: { valid: true } }),
    },
};
export const MOCK_DATA_LAYER_PROVIDER = {
    provide: DataLayerService,
    useValue: {
        buildErrorInfo: () => {},
        getData: () => {},
        update: () => {},
        setDigitalDataProps: () => {},
        updateAndSendPageTrackEvent: () => {},
        sendExplicitEventTrackEvent: () => {},
    },
};

export const MOCK_DATA_LAYER_PROVIDERS = [
    {
        provide: DataLayerService,
        useValue: {
            buildErrorInfo: () => {},
            getData: () => {},
            update: () => {},
            setDigitalDataProps: () => {},
            updateAndSendPageTrackEvent: () => {},
            sendExplicitEventTrackEvent: () => {},
        },
    },
    {
        provide: SharedEventTrackService,
        useValue: {
            track: () => {},
        },
    },
];

export const MOCK_CORE_LOGGER_PROVIDER = {
    provide: CoreLoggerService,
    useValue: {
        debug: () => {},
    },
};
export const MOCK_NGRX_STORE_PROVIDER = {
    provide: Store,
    useValue: {
        dispatch: action('store.dispatch'),
        select: mockLegacySelectFunction,
        pipe: () => of(),
    },
};
export const MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER = {
    provide: DataIdentityRequestStoreService,
    useValue: {
        setIdentityRequestData: () => {},
        getIdentityRequestData: () => {},
    },
};

export const MOCK_BIN_RANGES_TOKEN_PROVIDER = {
    provide: BinRangesToken,
    useValue: [
        {
            name: 'Ck',
            type: '9',
            regex: null,
        },
        {
            name: 'Sa',
            type: '10',
            regex: null,
        },
        {
            name: 'VS_BH_TEST_ONLY',
            type: '8',
            regex: '^4436135021[0-9]{6}$',
        },
        {
            name: 'VS',
            type: '3',
            regex: '^4[0-9]{12}$|^4[0-9]{15}$',
        },
        {
            name: 'MC',
            type: '2',
            regex: '^5[1-5][0-9]{14}$|^222[1-9][0-9]{12}$|^22[3-9][0-9]{13}$|^2[3-6][0-9]{14}$|^27[01][0-9]{13}$|^2720[0-9]{12}$',
        },
        {
            name: 'AM',
            type: '1',
            regex: '^37[0-9]{13}$|^34[0-9]{13}$',
        },
        {
            name: 'CU',
            type: '7',
            regex: '^81[0-6][0-9]{13}$|^817[0-1][0-9]{12}$|^621094[0-9]{10}$|^62[4-6][0-9]{13}$|^628[2-8][0-9]{12}$|^62292[6-9][0-9]{10}$|^6229[3-9][0-9]{11}$|^623[0-6][0-9]{12}$|^6237[0-8][0-9]{11}$|^62379[0-6][0-9]{10}$',
        },
        {
            name: 'DI',
            type: '4',
            regex: '^60110[0-9]{11}$|^6011[2-4][0-9]{11}$|^601174[0-9]{10}$|^60117[7-9][0-9]{10}$|^60118[6-9][0-9]{10}$|^60119[0-9]{11}$|^62212[6-9][0-9]{10}$|^6221[3-9][0-9]{11}$|^622[2-8][0-9]{12}$|^6229[01][0-9]{11}$|^62292[0-5][0-9]{10}$|^64[4-9][0-9]{13}$|^65[0-9]{14}$',
        },
        {
            name: 'DD',
            type: '6',
            regex: '^30[0-5][0-9]{11}$|^3095[0-9]{10}$|^36[0-9]{12}$|^3[8-9][0-9]{12}$',
        },
        {
            name: 'JC',
            type: '5',
            regex: '^3528[0-9]{12}$|^3529[0-9]{12}$|^3530[0-9]{12}$|^3531[0-9]{12}$|^3532[0-9]{12}$|^3533[0-9]{12}$|^3534[0-9]{12}$|^3535[0-9]{12}$|^3536[0-9]{12}$|^3537[0-9]{12}$|^3538[0-9]{12}$|^3539[0-9]{12}$|^3540[0-9]{12}$|^3541[0-9]{12}$|^3542[0-9]{12}$|^3543[0-9]{12}$|^3544[0-9]{12}$|^3545[0-9]{12}$|^3546[0-9]{12}$|^3547[0-9]{12}$|^3548[0-9]{12}$|^3549[0-9]{12}$|^3550[0-9]{12}$|^3551[0-9]{12}$|^3552[0-9]{12}$|^3553[0-9]{12}$|^3554[0-9]{12}$|^3555[0-9]{12}$|^3556[0-9]{12}$|^3557[0-9]{12}$|^3558[0-9]{12}$|^3559[0-9]{12}$|^3560[0-9]{12}$|^3561[0-9]{12}$|^3562[0-9]{12}$|^3563[0-9]{12}$|^3564[0-9]{12}$|^3565[0-9]{12}$|^3566[0-9]{12}$|^3567[0-9]{12}$|^3568[0-9]{12}$|^3569[0-9]{12}$|^3570[0-9]{12}$|^3571[0-9]{12}$|^3572[0-9]{12}$|^3573[0-9]{12}$|^3574[0-9]{12}$|^3575[0-9]{12}$|^3576[0-9]{12}$|^3577[0-9]{12}$|^3578[0-9]{12}$|^3579[0-9]{12}$|^3580[0-9]{12}$|^3581[0-9]{12}$|^3582[0-9]{12}$|^3583[0-9]{12}$|^3584[0-9]{12}$|^3585[0-9]{12}$|^3586[0-9]{12}$|^3587[0-9]{12}$|^3588[0-9]{12}$|^3589[0-9]{12}$',
        },
    ],
};

function mockLegacySelectFunction() {
    console.warn('Looks like the legacy NgRx store.select is being used. Please update to store.pipe(select())');
    return { pipe: () => of() };
}
