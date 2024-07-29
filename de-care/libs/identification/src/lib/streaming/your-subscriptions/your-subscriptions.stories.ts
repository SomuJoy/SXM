// TODO: STORYBOOK_AUDIT

// import { HttpClientModule } from '@angular/common/http';
// import { DataOfferService, SubscriptionActionTypeEnum } from '@de-care/data-services';
// import { IdentificationModule } from '../../identification.module';
// import { SettingsService } from '@de-care/settings';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
//
// const stories = storiesOf('identification/streaming/your-subscriptions', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [HttpClientModule, IdentificationModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 { provide: SettingsService, useValue: { settings: { country: 'us', apiUrl: '' } } },
//                 { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([{ name: 'SiriusXM Select', packageName: '1_SIR_AUD_EVT' }]) } }
//             ]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: false,
//                     dateFormat: 'MM/dd/y',
//                     settings: { country: 'us', apiUrl: '' }
//                 }
//             },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         if (locale === 'en_US') {
//                             return of([
//                                 {
//                                     name: 'SiriusXM Select',
//                                     packageName: '1_SIR_AUD_EVT'
//                                 },
//                                 {
//                                     name: 'SiriusXM Premier Streaming',
//                                     packageName: 'SIR_IP_SA_CMS'
//                                 }
//                             ]);
//                         } else if (locale === 'fr_CA') {
//                             return of([
//                                 {
//                                     name: 'FR:: SiriusXM All Access',
//                                     packageName: 'SXM_SIR_AUD_ALLACCESS'
//                                 },
//                                 {
//                                     name: 'FR:: SiriusXM Premier Streaming',
//                                     packageName: 'SIR_IP_SA_CMS'
//                                 }
//                             ]);
//                         }
//                     }
//                 }
//             }
//         ]
//     },
//     template: `<your-subscriptions [subscriptions]="subscriptions"></your-subscriptions>`,
//     props: {
//         subscriptions: {
//             currentSubscriptions: [
//                 {
//                     subActionType: SubscriptionActionTypeEnum.SIGN_IN,
//                     plans: [
//                         {
//                             packageName: '1_SIR_AUD_EVT'
//                         }
//                     ],
//                     radioService: {
//                         vehicleInfo: {
//                             model: 'Rogue',
//                             make: 'Nissan',
//                             year: '2017'
//                         }
//                     },
//                     streamingService: {
//                         status: 'Active',
//                         randomCredentials: false,
//                         hasCredentials: true
//                     }
//                 }
//             ],
//             offeredSubscriptions: [
//                 {
//                     subActionType: SubscriptionActionTypeEnum.ADD_SUB,
//                     plans: [
//                         {
//                             packageName: 'SIR_IP_SA_CMS',
//                             endDate: new Date(),
//                             expired: false
//                         }
//                     ],
//                     radioService: {
//                         vehicleInfo: null
//                     },
//                     streamingService: {
//                         status: '',
//                         randomCredentials: false,
//                         hasCredentials: false
//                     }
//                 },
//                 {
//                     subActionType: SubscriptionActionTypeEnum.ADD_SUB,
//                     plans: [
//                         {
//                             packageName: 'SIR_IP_SA_CMS',
//                             endDate: new Date(),
//                             expired: true
//                         }
//                     ],
//                     radioService: {
//                         vehicleInfo: null
//                     },
//                     streamingService: {
//                         status: '',
//                         randomCredentials: false,
//                         hasCredentials: false
//                     }
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('in Canada', () => ({
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     dateFormat: 'MMMM d, y',
//                     settings: { country: 'ca', apiUrl: '' }
//                 }
//             },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         if (locale === 'en_US') {
//                             return of([
//                                 {
//                                     name: 'SiriusXM Select',
//                                     packageName: '1_SIR_AUD_EVT'
//                                 },
//                                 {
//                                     name: 'SiriusXM Premier Streaming',
//                                     packageName: 'SIR_IP_SA_CMS'
//                                 }
//                             ]);
//                         } else if (locale === 'fr_CA') {
//                             return of([
//                                 {
//                                     name: 'FR:: SiriusXM All Access',
//                                     packageName: 'SXM_SIR_AUD_ALLACCESS'
//                                 },
//                                 {
//                                     name: 'FR:: SiriusXM Premier Streaming',
//                                     packageName: 'SIR_IP_SA_CMS'
//                                 }
//                             ]);
//                         }
//                     }
//                 }
//             }
//         ]
//     },
//     template: `<your-subscriptions [subscriptions]="subscriptions"></your-subscriptions>`,
//     props: {
//         subscriptions: {
//             currentSubscriptions: [
//                 {
//                     subActionType: SubscriptionActionTypeEnum.SIGN_IN,
//                     plans: [
//                         {
//                             packageName: '1_SIR_AUD_EVT'
//                         }
//                     ],
//                     radioService: {
//                         vehicleInfo: {
//                             model: 'Rogue',
//                             make: 'Nissan',
//                             year: '2017'
//                         }
//                     },
//                     streamingService: {
//                         status: 'Active',
//                         randomCredentials: false,
//                         hasCredentials: true
//                     }
//                 }
//             ],
//             offeredSubscriptions: [
//                 {
//                     subActionType: SubscriptionActionTypeEnum.ADD_SUB,
//                     plans: [
//                         {
//                             packageName: 'SIR_IP_SA_CMS',
//                             endDate: new Date(),
//                             expired: false
//                         }
//                     ],
//                     radioService: {
//                         vehicleInfo: null
//                     },
//                     streamingService: {
//                         status: '',
//                         randomCredentials: false,
//                         hasCredentials: false
//                     }
//                 },
//                 {
//                     subActionType: SubscriptionActionTypeEnum.ADD_SUB,
//                     plans: [
//                         {
//                             packageName: 'SIR_IP_SA_CMS',
//                             endDate: new Date(),
//                             expired: true
//                         }
//                     ],
//                     radioService: {
//                         vehicleInfo: null
//                     },
//                     streamingService: {
//                         status: '',
//                         randomCredentials: false,
//                         hasCredentials: false
//                     }
//                 }
//             ]
//         }
//     }
// }));
