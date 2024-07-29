// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { IdentificationModule } from '../../../identification.module';
// import { TRANSLATE_PROVIDERS, withTranslation, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { withKnobs } from '@storybook/addon-knobs';
// import { SubscriptionItemComponent } from './subscription-item.component';
// import { UserSettingsService, SettingsService } from '@de-care/settings';
// import { SubscriptionActionTypeEnum, IdentityLookupPhoneOrEmailResponseModel, DataOfferService, PlanTypeEnum } from '@de-care/data-services';
// import { action } from '@storybook/addon-actions';
// import { of } from 'rxjs';
//
// function getSubscription(subActionType: SubscriptionActionTypeEnum): IdentityLookupPhoneOrEmailResponseModel {
//     return {
//         status: '',
//         subActionType,
//         plans: [
//             {
//                 packageName: 'SIR_AUD_EVT',
//                 type: PlanTypeEnum.Trial,
//                 endDate: new Date().toString(),
//                 code: '',
//                 termLength: 3,
//                 expired: false,
//                 capabilities: ['AUD']
//             }
//         ],
//         radioService: {
//             vehicleInfo: {
//                 model: 'Rogue',
//                 make: 'Nissan',
//                 year: '2017'
//             },
//             last4DigitsOfRadioId: '1234'
//         },
//         followonPlans: [],
//         streamingService: {
//             maskedUserName: null,
//             status: 'Active',
//             randomCredentials: false
//         }
//     };
// }
//
// function getPremSub(expired: boolean): IdentityLookupPhoneOrEmailResponseModel {
//     const sub = getSubscription(SubscriptionActionTypeEnum.ADD_SUB);
//     sub.plans[0].packageName = 'SIR_IP_SA_CMS';
//     sub.radioService.vehicleInfo = null;
//     sub.plans[0].expired = expired;
//     console.log(sub.subActionType);
//     return sub;
// }
//
// function getSubscriptionWithMaskedUsername(subActionType: SubscriptionActionTypeEnum) {
//     const sub = getSubscription(subActionType);
//     sub.streamingService.maskedUserName = 'sam*****@gmail.com';
//     return sub;
// }
//
// function getSubscriptionWithRadioIdOnly(subActionType: SubscriptionActionTypeEnum) {
//     const sub = getSubscription(subActionType);
//     sub.radioService.vehicleInfo = null;
//     return sub;
// }
//
// const stories = storiesOf('identification/streaming/subscription-item', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: ({ locale }) => {
//                             if (locale === 'en_US') {
//                                 return of([
//                                     {
//                                         name: 'SiriusXM Select',
//                                         packageName: 'SIR_AUD_EVT'
//                                     },
//                                     {
//                                         name: 'SiriusXM Premier Streaming',
//                                         packageName: 'SIR_IP_SA_CMS'
//                                     }
//                                 ]);
//                             } else if (locale === 'fr_CA') {
//                                 return of([
//                                     {
//                                         name: 'FR:: SiriusXM Select',
//                                         packageName: 'SIR_AUD_EVT'
//                                     },
//                                     {
//                                         name: 'FR:: SiriusXM Premier Streaming',
//                                         packageName: 'SIR_IP_SA_CMS'
//                                     }
//                                 ]);
//                             }
//                         }
//                     }
//                 }
//             ]
//         })
//     )
//     .addDecorator(withTranslation)
//     .addDecorator(withMockSettings)
//     .addDecorator(withKnobs);
//
// stories.add('with sign in', () => ({
//     component: SubscriptionItemComponent,
//     props: {
//         subscription: getSubscription(SubscriptionActionTypeEnum.SIGN_IN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with sign in Canada', () => ({
//     component: SubscriptionItemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         subscription: getSubscription(SubscriptionActionTypeEnum.SIGN_IN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with create login', () => ({
//     component: SubscriptionItemComponent,
//     props: {
//         subscription: getSubscription(SubscriptionActionTypeEnum.CREATE_LOGIN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with create login in Canada', () => ({
//     component: SubscriptionItemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     settings: { country: 'ca' }
//                 }
//             }
//         ]
//     },
//     props: {
//         subscription: getSubscription(SubscriptionActionTypeEnum.CREATE_LOGIN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with premier plan', () => ({
//     component: SubscriptionItemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     dateFormat$: of('MM/dd/yy')
//                 }
//             }
//         ]
//     },
//     props: {
//         subscription: getPremSub(false),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with premier plan in Canada', () => ({
//     component: SubscriptionItemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     settings: { country: 'ca' }
//                 }
//             }
//         ]
//     },
//     props: {
//         subscription: getPremSub(false),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with premier plan in Canada French', () => ({
//     component: SubscriptionItemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     settings: { country: 'ca' }
//                 }
//             },
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     dateFormat$: of('d MMMM y')
//                 }
//             }
//         ]
//     },
//     props: {
//         subscription: getPremSub(false),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with premier plan expired', () => ({
//     component: SubscriptionItemComponent,
//     props: {
//         subscription: getPremSub(true),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with premier plan expired in Canada', () => ({
//     component: SubscriptionItemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     settings: { country: 'ca' }
//                 }
//             }
//         ]
//     },
//     props: {
//         subscription: getPremSub(true),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with masked username', () => ({
//     component: SubscriptionItemComponent,
//     props: {
//         subscription: getSubscriptionWithMaskedUsername(SubscriptionActionTypeEnum.SIGN_IN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with vehicle info', () => ({
//     component: SubscriptionItemComponent,
//     props: {
//         subscription: getSubscription(SubscriptionActionTypeEnum.SIGN_IN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
//
// stories.add('with radio id only', () => ({
//     component: SubscriptionItemComponent,
//     props: {
//         subscription: getSubscriptionWithRadioIdOnly(SubscriptionActionTypeEnum.SIGN_IN),
//         actionClicked: action('@Output() actionClicked emitted')
//     }
// }));
