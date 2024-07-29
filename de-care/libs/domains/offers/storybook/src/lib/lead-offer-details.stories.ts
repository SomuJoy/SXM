// TODO: STORYBOOK_AUDIT

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SettingsService } from '@de-care/settings';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { DataOfferService } from '@de-care/data-services';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { OffersModule, LeadOfferDetailsComponent } from '@de-care/offers';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { of } from 'rxjs';
//
// export const mockOffer = {
//     isFreeOffer: false,
//     packageName: 'SXM_SIR_AUD_ALLACCESS',
//     type: 'PROMO',
//     pricePerMonth: 4.99,
//     price: 29.99,
//     retailPrice: 30.0,
//     termLength: 6
// } as const;
//
// export const mockChoiceOffer = {
//     packageName: 'SIR_AUD_CHOICE_CTRY',
//     type: 'SELF_PAY',
//     pricePerMonth: 7.99,
//     price: 7.99,
//     retailPrice: 7.99,
//     termLength: 1
// } as const;
//
// const mockPackageDescriptionsProvider = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'en_US') {
//                 return of([
//                     {
//                         name: 'SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS',
//                         description: '',
//                         promoFooter: 'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//                         channels: [
//                             {
//                                 title: '<b>SiriusXM All Access Includes:</b>',
//                                 descriptions: [
//                                     '140+ Channels',
//                                     '85 ad-free music channels',
//                                     'Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//                                     'Listen in your car from coast to coast'
//                                 ]
//                             }
//                         ]
//                     },
//                     {
//                         name: 'Sirius Choice',
//                         packageName: 'SIR_AUD_CHOICE_GENERIC',
//                         header: "Enjoy 52 channels of music & talk. Plus, you'll get 3 more channels from the genre of your choice:",
//                         channels: [
//                             {
//                                 title: '<b>Sirius Choice Includes:</b>',
//                                 count: '55',
//                                 descriptions: [
//                                     '55 channels in your car, on your phone, at home, and online',
//                                     'Ad-free music, select news, talk and entertainment channels',
//                                     'Includes 3 bonus channels in Country, Hip-Hop/R&B, Pop, Classic Rock, or Current Rock'
//                                 ]
//                             }
//                         ]
//                     },
//                     {
//                         name: 'Sirius Choice Country',
//                         shortName: 'Country',
//                         packageName: 'SIR_AUD_CHOICE_CTRY',
//                         channelLineUpURL: null,
//                         channels: [
//                             {
//                                 title: 'Country channels:',
//                                 upsellTitle: null,
//                                 count: null,
//                                 descriptions: ['Prime Country', 'The Highway', 'Y2Kountry'],
//                                 features: null
//                             }
//                         ],
//                         parentPackageName: 'SIR_AUD_CHOICE_GENERIC'
//                     }
//                 ]);
//             }
//         }
//     }
// };
//
// const stories = storiesOf('offers/lead-offer-details', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: LeadOfferDetailsComponent,
//     template: `
//     <!--Note that this component relies on parent styling to work...should look into elevating this so component can work other places -->
//             <div style="padding-top: 200px;">
//                 <lead-offer-details [offer]="offer" [account]="account" [excludePriceAndTermDisplay]="excludePriceAndTermDisplay"></lead-offer-details>
//             </div>
//         `,
//     props: {
//         offer: mockOffer,
//         account: {
//             closedDevices: [
//                 {
//                     last4DigitsOfRadioId: 4444,
//                     vehicleInfo: {
//                         year: '2019',
//                         make: 'Subaru',
//                         model: 'Crosstrek'
//                     }
//                 }
//             ]
//         },
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false)
//     }
// }));
//
// stories.add('Choice with parentPackage', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: LeadOfferDetailsComponent,
//     template: `
//     <!--Note that this component relies on parent styling to work...should look into elevating this so component can work other places -->
//             <div style="padding-top: 200px;">
//                 <lead-offer-details [offer]="offer" [account]="account" [excludePriceAndTermDisplay]="excludePriceAndTermDisplay"></lead-offer-details>
//             </div>
//         `,
//     props: {
//         offer: mockChoiceOffer,
//         account: {
//             closedDevices: [
//                 {
//                     last4DigitsOfRadioId: 4444,
//                     vehicleInfo: {
//                         year: '2019',
//                         make: 'Subaru',
//                         model: 'Crosstrek'
//                     }
//                 }
//             ]
//         },
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false)
//     }
// }));
//
// stories.add('lead-offer-details: in canada', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: LeadOfferDetailsComponent,
//     template: `
//     <!--Note that this component relies on parent styling to work...should look into elevating this so component can work other places -->
//             <div style="padding-top: 200px;">
//                 <lead-offer-details [offer]="offer" [account]="account"></lead-offer-details>
//             </div>
//         `,
//     props: {
//         offer: mockOffer,
//         account: {
//             closedDevices: [
//                 {
//                     last4DigitsOfRadioId: 4444,
//                     vehicleInfo: {
//                         year: '2019',
//                         make: 'Subaru',
//                         model: 'Crosstrek'
//                     }
//                 }
//             ]
//         }
//     }
// }));
