// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, MOCK_DATA_LAYER_PROVIDER, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { ActiveSubscriptionInfo } from './active-subscription.component';
// import { action } from '@storybook/addon-actions';
// import { PlanTypeEnum, DataOfferService, SubscriptionStatusEnum } from '@de-care/data-services';
// import { ActiveSubscriptionComponent } from '../../subscription/active-subscription/active-subscription.component';
// import { of } from 'rxjs';
// import { IdentificationModule } from '../../identification.module';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { withKnobs } from '@storybook/addon-knobs';
// import { SxmUiModule } from '@de-care/sxm-ui';
//
// const mockPackageDescriptionsProvider = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'en_US') {
//                 return of([
//                     {
//                         name: 'SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS'
//                     }
//                 ]);
//             } else if (locale === 'fr_CA') {
//                 return of([
//                     {
//                         name: 'FR:: SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS'
//                     }
//                 ]);
//             }
//         }
//     }
// };
//
// const mockActiveSubscriptionInfo: ActiveSubscriptionInfo = {
//     subscription: {
//         subscriptionId: '',
//         id: null,
//         radioService: {
//             last4DigitsOfRadioId: 'AC23',
//             is360LCapable: false,
//             id: null,
//             vehicleInfo: {
//                 year: '2019',
//                 make: 'Toyota',
//                 model: 'Camry'
//             }
//         },
//         plans: [
//             {
//                 type: PlanTypeEnum.Trial,
//                 packageName: 'SXM_SIR_AUD_ALLACCESS',
//                 name: 'SXM All Access',
//                 endDate: '06/14/2020',
//                 code: null,
//                 termLength: null,
//                 startDate: null,
//                 nextCycleOn: null
//             }
//         ],
//         followonPlans: []
//     },
//     flepzData: {
//         firstName: 'Tony',
//         lastName: 'Stark',
//         email: 'tstark@gmail.com',
//         phoneNumber: '9992223333',
//         zipCode: '555554444'
//     }
// };
//
// const mockActiveSubscriptionInfoStreaming: ActiveSubscriptionInfo = {
//     subscription: {
//         subscriptionId: '',
//         id: null,
//         streamingService: {
//             id: null,
//             status: SubscriptionStatusEnum.ACTIVE,
//             maskedUserName: 's****m'
//         },
//         status: SubscriptionStatusEnum.ACTIVE,
//         radioService: {
//             last4DigitsOfRadioId: 'AC23',
//             is360LCapable: false,
//             id: null,
//             vehicleInfo: {
//                 year: '2019',
//                 make: 'Toyota',
//                 model: 'Camry'
//             }
//         },
//         plans: [
//             {
//                 type: PlanTypeEnum.SelfPaid,
//                 packageName: 'SXM_SIR_AUD_ALLACCESS',
//                 name: 'SXM All Access',
//                 endDate: new Date().toString(),
//                 code: null,
//                 termLength: null,
//                 startDate: null,
//                 nextCycleOn: new Date().toString()
//             }
//         ],
//         followonPlans: []
//     },
//     flepzData: null
// };
//
// const stories = storiesOf('identification/streaming/active-subscription', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule],
//             providers: [mockPackageDescriptionsProvider]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withKnobs)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('default', () => ({
//     component: ActiveSubscriptionComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isCanadaMode: false,
//                     dateFormat$: of('MM/dd/y')
//                 }
//             }
//         ]
//     },
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfo,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
//
// stories.add('default in Canada', () => ({
//     component: ActiveSubscriptionComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isCanadaMode: false,
//                     dateFormat$: of('MMMM d, y')
//                 }
//             }
//         ]
//     },
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfo,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
//
// stories.add('default in French', () => ({
//     component: ActiveSubscriptionComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isCanadaMode: false,
//                     dateFormat$: of('d MMMM y')
//                 }
//             }
//         ]
//     },
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfo,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
//
// stories.add('default in modal', () => ({
//     moduleMetadata: {
//         providers: [MOCK_DATA_LAYER_PROVIDER],
//         imports: [SxmUiModule]
//     },
//     template: `
//         <sxm-ui-modal [closed]="false" title="Radio Lookup" [titlePresent]="true">
//             <active-subscription
//                 [activeSubscriptionInfo]="activeSubscriptionInfo"
//                 (loginRequested)="loginRequested()"
//                 (lookupNewRadioRequested)="lookupNewRadioRequested()"
//                 (editAccountInfoRequested)="editAccountInfoRequested()"></active-subscription>
//         </sxm-ui-modal>
//     `,
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfo,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
//
// stories.add('streaming', () => ({
//     component: ActiveSubscriptionComponent,
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfoStreaming,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
//
// stories.add('streaming in Canada', () => ({
//     component: ActiveSubscriptionComponent,
//     moduleMetadata: {
//         providers: [
//             MOCK_DATA_LAYER_PROVIDER,
//             mockPackageDescriptionsProvider,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     dateFormat: 'MMMM d, y'
//                 }
//             },
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isQuebec$: of(false)
//                 }
//             }
//         ]
//     },
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfoStreaming,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
//
// stories.add('streaming in modal', () => ({
//     moduleMetadata: {
//         providers: [MOCK_DATA_LAYER_PROVIDER],
//         imports: [SxmUiModule]
//     },
//     template: `
//         <sxm-ui-modal [closed]="false" title="Radio Lookup" [titlePresent]="true">
//             <active-subscription
//                 [activeSubscriptionInfo]="activeSubscriptionInfo"
//                 (loginRequested)="loginRequested()"
//                 (lookupNewRadioRequested)="lookupNewRadioRequested()"
//                 (editAccountInfoRequested)="editAccountInfoRequested()"></active-subscription>
//         </sxm-ui-modal>
//     `,
//     props: {
//         activeSubscriptionInfo: mockActiveSubscriptionInfoStreaming,
//         loginRequested: action('loginRequested'),
//         lookupNewRadioRequested: action('lookupNewRadioRequested'),
//         editAccountInfoRequested: action('editAccountInfoRequested')
//     }
// }));
