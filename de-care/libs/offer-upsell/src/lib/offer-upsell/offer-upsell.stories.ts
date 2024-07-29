// TODO: STORYBOOK_AUDIT

// import { RouterTestingModule } from '@angular/router/testing';
// import { DataOfferService } from '@de-care/data-services';
// import { OfferUpsellModule } from '../offer-upsell.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { object, number, boolean, withKnobs } from '@storybook/addon-knobs';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { of } from 'rxjs';
// import { OfferUpsellComponent } from './offer-upsell.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
//
// const MockUpgrades = {
//     originalOffer: [
//         {
//             planCode: 'Promo - Select - 6mo - 29.94 (4.99FOR6) - WBFB',
//             packageName: 'SIR_AUD_EVT',
//             promoCode: 'WBFBOEM',
//             termLength: 6,
//             type: 'PROMO',
//             marketType: 'self-pay:promo',
//             price: 29.94,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             supportedServices: ['SIR', 'UNIVERSAL_LOGIN', 'ESN'],
//             deal: null,
//             fallback: true
//         }
//     ],
//     upgradeOffers: {
//         plan: 'Promo - Select - 6mo - 29.94 (4.99FOR6) - WBFB',
//         upgrade: [
//             {
//                 packageName: 'SIR_AUD_ALLACCESS',
//                 planCode: 'Promo - All Access - 6mo (49.99) - 1X',
//                 price: 49.99,
//                 retailPrice: 20.99,
//                 termLength: 6,
//                 type: 'PROMO',
//                 pricePerMonth: 8.33,
//                 upsellType: 'Package',
//                 marketType: 'self-pay:promo',
//                 deal: null,
//                 header: 'The following package description is presented for Sirius All Access packages:',
//                 description: null
//             },
//             {
//                 packageName: 'SIR_AUD_EVT',
//                 planCode: 'Promo - Select - 12mo - 99.00 - (1X)',
//                 price: 99,
//                 retailPrice: 15.99,
//                 termLength: 12,
//                 type: 'PROMO',
//                 pricePerMonth: 8.25,
//                 upsellType: 'Term',
//                 marketType: 'self-pay:promo',
//                 deal: null,
//                 header: 'The following package description is presented for Sirius Select packages:',
//                 description: null
//             },
//             {
//                 packageName: 'SIR_AUD_ALLACCESS',
//                 planCode: 'Promo - All Access - 12mo - 119.88 (9.99/mo) - 1X',
//                 price: 119.88,
//                 retailPrice: 20.99,
//                 termLength: 12,
//                 type: 'PROMO',
//                 pricePerMonth: 9.99,
//                 upsellType: 'PackageAndTerm',
//                 marketType: 'self-pay:promo',
//                 deal: null,
//                 header: 'The following package description is presented for Sirius All Access packages:',
//                 description: null
//             }
//         ]
//     }
// };
//
// const stories = storiesOf('offer-upsell', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OfferUpsellModule, RouterTestingModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('offer-upsell', () => ({
//     component: OfferUpsellComponent,
//     props: {
//         upgrades: object('@Input Upgrades', MockUpgrades),
//         stepNumber: number('@Input stepNumber', 3),
//         isFlepz: boolean('@Input isFlepz', false),
//         loading: boolean('@Input loading', false)
//     },
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             MOCK_NGRX_STORE_PROVIDER,
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) =>
//                         of([
//                             {
//                                 name: 'Sirius Select',
//                                 packageName: 'SIR_AUD_EVT',
//                                 description: '',
//                                 promoFooter: 'Listen everywhere',
//                                 channels: [{ title: '<b>Sirius Select Includes:</b>', descriptions: ['140+ Channels'] }]
//                             },
//                             {
//                                 name: 'Sirius All Access',
//                                 packageName: 'SIR_AUD_ALLACCESS',
//                                 description: '',
//                                 promoFooter: 'Listen everywhere',
//                                 channels: [{ title: '<b>Sirius All Access Includes:</b>', descriptions: ['140+ Channels'] }]
//                             }
//                         ])
//                 }
//             }
//         ]
//     }
// }));
//
// stories.add('offer-upsell: in canada', () => ({
//     component: OfferUpsellComponent,
//     props: {
//         upgrades: object('@Input Upgrades', MockUpgrades),
//         stepNumber: number('@Input stepNumber', 3),
//         isFlepz: boolean('@Input isFlepz', false),
//         loading: boolean('@Input loading', false)
//     },
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             MOCK_NGRX_STORE_PROVIDER,
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             { provide: UserSettingsService, useValue: { isQuebec$: of(true) } },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         if (locale === 'en_US') {
//                             return of([
//                                 {
//                                     name: 'Sirius Select',
//                                     packageName: 'SIR_AUD_EVT',
//                                     description: '',
//                                     promoFooter: 'Listen everywhere',
//                                     channels: [{ title: '<b>Sirius Select Includes:</b>', descriptions: ['140+ Channels'] }]
//                                 },
//                                 {
//                                     name: 'Sirius All Access',
//                                     packageName: 'SIR_AUD_ALLACCESS',
//                                     description: '',
//                                     promoFooter: 'Listen everywhere',
//                                     channels: [{ title: '<b>Sirius All Access Includes:</b>', descriptions: ['140+ Channels'] }]
//                                 }
//                             ]);
//                         } else if (locale === 'fr_CA') {
//                             return of([
//                                 {
//                                     name: 'FR:: Sirius Select',
//                                     packageName: 'SIR_AUD_EVT',
//                                     description: '',
//                                     promoFooter: 'FR:: Listen everywhere',
//                                     channels: [{ title: '<b>FR:: Sirius Select Includes:</b>', descriptions: ['FR:: 140+ Channels'] }]
//                                 },
//                                 {
//                                     name: 'FR:: Sirius All Access',
//                                     packageName: 'SIR_AUD_ALLACCESS',
//                                     description: '',
//                                     promoFooter: 'FR:: Listen everywhere',
//                                     channels: [{ title: '<b>FR:: Sirius All Access Includes:</b>', descriptions: ['FR:: 140+ Channels'] }]
//                                 }
//                             ]);
//                         }
//                     }
//                 }
//             }
//         ]
//     }
// }));
