// TODO: STORYBOOK_AUDIT

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { DataAccountService, DataIdentityService, DataOfferService, PackagePlatformEnum, PlanTypeEnum } from '@de-care/data-services';
// import { OfferDescriptionComponent, OfferInfo } from '@de-care/domains/offers/ui-offer-description';
// import { PurchaseModule } from '@de-care/purchase';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { object, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { DifferentPlatformComponent, PlatformChangeInfo, LeadOfferDetailsComponent, OffersModule } from '@de-care/offers';
// // import { DifferentPlatformComponent, PlatformChangeInfo } from './different-platform/different-platform.component';
// // import { LeadOfferDetailsComponent } from './lead-offer-details/lead-offer-details.component';
// // import { OffersModule } from './offers.module';
//
// export const OFFERS_STORYBOOK_STORIES = storiesOf('offers', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// const platformChangeInfo = {
//     currentSubscription: {
//         radio: {
//             vehicleInfo: {
//                 year: 2017,
//                 make: 'Nissan',
//                 model: 'Rogue'
//             }
//         },
//         plans: [
//             {
//                 type: PlanTypeEnum.Trial,
//                 packageName: 'SXM_SIR_AUD_ALLACCESS',
//                 endDate: '2019-07-30T00:00:00-04:00'
//             }
//         ]
//     },
//     platformChangePlan: {
//         platform: PackagePlatformEnum.Xm,
//         packageName: 'SXM_SIR_AUD_ALLACCESS'
//     },
//     upsellInfo: {
//         planCode: 'SiriusXM All Access',
//         radioId: '1234',
//         upsellCode: 'asdf',
//         province: undefined
//     }
// } as PlatformChangeInfo;
//
// OFFERS_STORYBOOK_STORIES.add('different-platform', () => ({
//     component: DifferentPlatformComponent,
//     moduleMetadata: {
//         imports: [PurchaseModule],
//         providers: [
//             {
//                 provide: DataIdentityService,
//                 useValue: { radio: () => of({}) }
//             },
//             { provide: DataAccountService, useValue: { sanitizeVehicleInfo: () => of(true) } }
//         ]
//     },
//     props: {
//         accepted: action('@Output() accepted emitted'),
//         platformChangeInfo
//     }
// }));
//
// OFFERS_STORYBOOK_STORIES.add('different-platform: in modal', () => ({
//     template: `
//             <sxm-ui-modal [closed]="false" title="Radio Lookup" [titlePresent]="true">
//                 <different-platform
//                     [platformChangeInfo]="platformChangeInfo"
//                     (accepted)="accepted()">
//                 </different-platform>
//             </sxm-ui-modal>
//         `,
//     props: {
//         accepted: action('@Output() accepted emitted'),
//         platformChangeInfo
//     }
// }));
//
// // TODO: figure out a strategy for doing this in Stories better (reuse, etc)
// export const mockPackageDescriptionsProvider = {
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
// OFFERS_STORYBOOK_STORIES.add('offer-description', () => ({
//     moduleMetadata: {
//         providers: [{ provide: UserSettingsService, useValue: { isQuebec$: of(false) } }, mockPackageDescriptionsProvider]
//     },
//     component: OfferDescriptionComponent,
//     props: {
//         offerInfo: object('offerInfo', {
//             processingFee: null,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             termLength: 6,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             price: 15.99
//         } as OfferInfo)
//     }
// }));
//
// OFFERS_STORYBOOK_STORIES.add('offer-description: is quebec', () => ({
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             { provide: UserSettingsService, useValue: { isQuebec$: of(true) } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: OfferDescriptionComponent,
//     props: {
//         offerInfo: object('offerInfo', {
//             processingFee: null,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             termLength: 6,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             price: 15.99
//         } as OfferInfo)
//     }
// }));
//
// OFFERS_STORYBOOK_STORIES.add('lead-offer-details', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             {
//                 provide: SharedEventTrackService,
//                 useValue: {
//                     track: () => {}
//                 }
//             },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
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
//         offer: {
//             isFreeOffer: false,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             pricePerMonth: 4.99,
//             price: 29.99,
//             retailPrice: 30.0,
//             termLength: 6
//         },
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
//
// OFFERS_STORYBOOK_STORIES.add('lead-offer-details: in canada', () => ({
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SharedEventTrackService,
//                 useValue: {
//                     track: () => {}
//                 }
//             },
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
//         offer: {
//             isFreeOffer: false,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             pricePerMonth: 4.99,
//             price: 29.99,
//             retailPrice: 30.0,
//             termLength: 6
//         },
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
