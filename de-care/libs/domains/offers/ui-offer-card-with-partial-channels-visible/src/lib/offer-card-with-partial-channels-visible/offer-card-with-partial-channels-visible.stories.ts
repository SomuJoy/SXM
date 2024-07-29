// TODO: STORYBOOK_AUDIT

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { DataOfferService } from '@de-care/data-services';
// import { SettingsService } from '@de-care/settings';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { withA11y } from '@storybook/addon-a11y';
// import { boolean, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DomainsOffersUiOfferCardWithPartialChannelsVisibleModule } from '../domains-offers-ui-offer-card-with-partial-channels-visible.module';
// import { OfferCardWithPartialChannelsVisibleComponent } from './offer-card-with-partial-channels-visible.component';
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
//                     }
//                 ]);
//             } else if (locale === 'fr_CA') {
//                 return of([
//                     {
//                         name: 'FR:: SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS',
//                         description: '',
//                         promoFooter: 'FR:: Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//                         channels: [
//                             {
//                                 title: '<b>FR:: SiriusXM All Access Includes:</b>',
//                                 descriptions: [
//                                     'FR:: 140+ Channels',
//                                     'FR:: 85 ad-free music channels',
//                                     'FR:: Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//                                     'FR:: Listen in your car from coast to coast'
//                                 ]
//                             }
//                         ]
//                     }
//                 ]);
//             }
//         }
//     }
// };
//
// const stories = storiesOf('Domains/Offers/OfferCardWithPartialChannelsVisibleComponent', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiOfferCardWithPartialChannelsVisibleModule]
//         })
//     )
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('more than 1 channel bullet', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule, SxmUiModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: OfferCardWithPartialChannelsVisibleComponent,
//     template: `
//             <sxm-ui-content-card>
//                 <ng-container htmlContentForBody>
//                     <offer-card-with-partial-channels-visible
//                         [isRTC]="isRTC"
//                         [offerInfo]="offerInfo"
//                         [excludePriceAndTermDisplay]="excludePriceAndTermDisplay"
//                         [packageDescription]="packageDescription">
//                     </offer-card-with-partial-channels-visible>
//                 </ng-container>
//             </sxm-ui-content-card>
//
//         `,
//     props: {
//         isRTC: false,
//         offerInfo: {
//             isFreeOffer: false,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             pricePerMonth: 4.99,
//             price: 29.99,
//             retailPrice: 30.0,
//             termLength: 6
//         },
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false),
//         packageDescription: {
//             name: 'SiriusXM All Access',
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             description: '',
//             promoFooter: 'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//             channels: [
//                 {
//                     title: '<b>SiriusXM All Access Includes:</b>',
//                     descriptions: [
//                         '140+ Channels',
//                         '85 ad-free music channels',
//                         'Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//                         'Listen in your car from coast to coast'
//                     ]
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('1 channel bullet', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule, SxmUiModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: OfferCardWithPartialChannelsVisibleComponent,
//     template: `
//             <sxm-ui-content-card>
//                 <ng-container htmlContentForBody>
//                     <offer-card-with-partial-channels-visible
//                         [isRTC]="isRTC"
//                         [offerInfo]="offerInfo"
//                         [excludePriceAndTermDisplay]="excludePriceAndTermDisplay"
//                         [packageDescription]="packageDescription">
//                     </offer-card-with-partial-channels-visible>
//                 </ng-container>
//             </sxm-ui-content-card>
//
//         `,
//     props: {
//         isRTC: false,
//         offerInfo: {
//             isFreeOffer: false,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             pricePerMonth: 4.99,
//             price: 29.99,
//             retailPrice: 30.0,
//             termLength: 6
//         },
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false),
//         packageDescription: {
//             name: 'SiriusXM All Access',
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             description: '',
//             promoFooter: 'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//             channels: [
//                 {
//                     title: '<b>SiriusXM All Access Includes:</b>',
//                     descriptions: ['140+ Channels']
//                 }
//             ]
//         }
//     }
// }));
