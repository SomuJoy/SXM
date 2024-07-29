// TODO: STORYBOOK_AUDIT

// import { CustomerInfoModule } from '@de-care/customer-info';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { MOCK_NGRX_STORE_PROVIDER, MOCK_BIN_RANGES_TOKEN_PROVIDER, withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { CreditCards } from '@de-care/shared/legacy-core/core-constants';
// import { BillingInfoFormComponent } from './billing-info-form.component';
//
// const mock_providers = [MOCK_NGRX_STORE_PROVIDER, MOCK_BIN_RANGES_TOKEN_PROVIDER];
//
// const stories = storiesOf('ui-billing-info-form/billing-info-form', module)
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
//     component: BillingInfoFormComponent,
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
