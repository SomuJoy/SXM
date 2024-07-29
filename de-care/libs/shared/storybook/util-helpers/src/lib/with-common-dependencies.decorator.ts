import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DataOfferService } from '@de-care/data-services';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { makeDecorator } from '@storybook/addons';
import { of } from 'rxjs';
import { AppTimer, Timer } from '@de-care/shared/legacy-core/timer';
import { MOCK_DATA_LAYER_PROVIDERS, TRANSLATE_PROVIDERS } from './providers';

export const MOCK_ALL_PACKAGE_DESC = {
    allPackageDescriptions: ({ locale }) => {
        if (locale === 'en_US') {
            return of([
                {
                    name: 'SiriusXM All Access',
                    packageName: 'SXM_SIR_AUD_ALLACCESS',
                    description: '',
                    promoFooter: 'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
                    channels: [
                        {
                            title: '<b>SiriusXM All Access Includes:</b>',
                            descriptions: [
                                '140+ Channels',
                                '85 ad-free music channels',
                                'Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
                                'Listen in your car from coast to coast',
                            ],
                        },
                    ],
                },
            ]);
        } else if (locale === 'en_CA') {
            return of([
                {
                    name: 'CA:: SiriusXM All Access',
                    packageName: 'SXM_SIR_AUD_ALLACCESS',
                    description: '',
                    promoFooter: 'CA:: Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
                    channels: [
                        {
                            title: '<b>CA:: SiriusXM All Access Includes:</b>',
                            descriptions: [
                                'CA:: 140+ Channels',
                                'CA:: 85 ad-free music channels',
                                'CA:: Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
                                'CA:: Listen in your car from coast to coast',
                            ],
                        },
                    ],
                },
            ]);
        } else if (locale === 'fr_CA') {
            return of([
                {
                    name: 'FR:: SiriusXM All Access',
                    packageName: 'SXM_SIR_AUD_ALLACCESS',
                    description: '',
                    promoFooter: 'FR:: Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
                    channels: [
                        {
                            title: '<b>FR:: SiriusXM All Access Includes:</b>',
                            descriptions: [
                                'FR:: 140+ Channels',
                                'FR:: 85 ad-free music channels',
                                'FR:: Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
                                'FR:: Listen in your car from coast to coast',
                            ],
                        },
                    ],
                },
            ]);
        }
    },
};

/**
 * @deprecated
 */
export const withCommonDependencies = makeDecorator({
    name: 'withCommonDependencies',
    parameterName: 'dependencies',
    wrapper: (storyFn, context) => {
        const storyFunctionObject = storyFn(context) as any;
        if (!storyFunctionObject.moduleMetadata) {
            storyFunctionObject.moduleMetadata = {};
        }

        storyFunctionObject.moduleMetadata.imports = [
            BrowserAnimationsModule,
            CommonModule,
            HttpClientTestingModule,
            RouterTestingModule,
            StoreModule.forRoot({}),
            EffectsModule.forRoot([]),
            ...storyFunctionObject.moduleMetadata.imports,
        ];

        storyFunctionObject.moduleMetadata.providers = [
            ...MOCK_DATA_LAYER_PROVIDERS,
            ...TRANSLATE_PROVIDERS,
            provideMockStore(),
            { provide: AppTimer, useClass: Timer },
            { provide: Window, useValue: window },
            { provide: DataOfferService, useValue: { ...MOCK_ALL_PACKAGE_DESC, customer: () => of({}) } },
            {
                provide: SettingsService,
                useValue: {
                    isCanadaMode: false,
                    dateFormat: 'MM/dd/y',
                    settings: { country: 'us', apiUrl: '', sheerIdIdentificationWidgetUrl: '#', sheerIdIdentificationReVerificationWidgetUrl: '#' },
                },
            },
            { provide: UserSettingsService, useValue: { isQuebec$: of(false), dateFormat$: of('MM/dd/y') } },
            ...storyFunctionObject.moduleMetadata.providers,
        ];

        return storyFunctionObject;
    },
});
