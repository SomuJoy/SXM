// TODO: STORYBOOK_AUDIT

// import { CustomerInfoModule } from '../customer-info.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { MOCK_NGRX_STORE_PROVIDER, MOCK_BIN_RANGES_TOKEN_PROVIDER, withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { CreditCards } from '@de-care/shared/legacy-core/core-constants';
// import { PaymentInfoComponent } from './payment-info.component';
// import { DeCareEnvironmentToken } from '@de-care/de-care/shared/environment';
//
// const mock_providers = [
//     MOCK_NGRX_STORE_PROVIDER,
//     MOCK_BIN_RANGES_TOKEN_PROVIDER,
//     {
//         provide: DeCareEnvironmentToken,
//         useValue: {
//             enableCVV: true
//         }
//     }
// ];
//
// const stories = storiesOf('customer-info/payment-info', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [CustomerInfoModule]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: PaymentInfoComponent,
//     moduleMetadata: {
//         providers: [mock_providers]
//     },
//     props: {
//         accountData: {
//             account: {
//                 savedCC: {
//                     billingSummary: {
//                         creditCard: {
//                             type: CreditCards.Visa,
//                             last4Digits: '9999',
//                             status: 'ACTIVE'
//                         }
//                     }
//                 },
//                 closedDevices: [{ last4DigitsOfRadioId: '1234' }],
//                 subscriptions: [],
//                 offer: { offers: [{ planCode: '' }] },
//                 prepaidCard: {},
//                 billingSummary: {
//                     creditCard: {
//                         type: 'VISA',
//                         last4Digits: 4111,
//                         status: 'ACTIVE'
//                     }
//                 }
//             }
//         }
//     }
// }));
//
// stories.add('streaming', () => ({
//     component: PaymentInfoComponent,
//     moduleMetadata: {
//         providers: [mock_providers]
//     },
//     props: {
//         isStreaming: true,
//         accountData: {
//             isNewAccount: true,
//             hasEmailAddressOnFile: false,
//             account: {
//                 isNewAccount: true,
//                 hasEmailAddressOnFile: false,
//                 savedCC: {
//                     billingSummary: {
//                         creditCard: {
//                             type: CreditCards.Visa,
//                             last4Digits: '9999',
//                             status: 'ACTIVE'
//                         }
//                     }
//                 },
//                 closedDevices: [{ last4DigitsOfRadioId: '1234' }],
//                 subscriptions: [],
//                 offer: { offers: [{ planCode: '' }] },
//                 prepaidCard: {},
//                 billingSummary: {
//                     creditCard: {
//                         type: 'VISA',
//                         last4Digits: 4111,
//                         status: 'ACTIVE'
//                     }
//                 }
//             }
//         }
//     }
// }));
//
// //ToDo: Update the RTD use-case properties after resolving DEX-16627 and DEX-17062
// stories.add('streaming-RTD', () => ({
//     component: PaymentInfoComponent,
//     moduleMetadata: {
//         providers: [mock_providers]
//     },
//     props: {
//         isStreaming: true,
//         isRTDUseCase: true,
//         accountData: {
//             isNewAccount: true,
//             hasEmailAddressOnFile: false,
//             account: {
//                 isNewAccount: true,
//                 hasEmailAddressOnFile: false,
//                 savedCC: {
//                     billingSummary: {
//                         creditCard: {
//                             type: CreditCards.Visa,
//                             last4Digits: '9999',
//                             status: 'ACTIVE'
//                         }
//                     }
//                 },
//                 closedDevices: [{ last4DigitsOfRadioId: '1234' }],
//                 subscriptions: [],
//                 offer: { offers: [{ planCode: '' }] },
//                 prepaidCard: {},
//                 billingSummary: {
//                     creditCard: {
//                         type: 'VISA',
//                         last4Digits: 4111,
//                         status: 'ACTIVE'
//                     }
//                 }
//             }
//         }
//     }
// }));
