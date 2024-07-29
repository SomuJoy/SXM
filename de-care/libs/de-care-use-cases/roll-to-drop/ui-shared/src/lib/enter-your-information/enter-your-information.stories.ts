// TODO: STORYBOOK_AUDIT

// import { CustomerInfoModule } from '@de-care/customer-info';
// import { TranslateModule } from '@ngx-translate/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DomainsAccountUiNewAccountFormFieldsModule } from '@de-care/domains/account/ui-new-account-form-fields';
// import { DomainsPurchaseUiTrialFollowOnFormFieldModule } from '@de-care/domains/purchase/ui-trial-follow-on-form-field';
// import { DomainsPurchaseUiCreditCardFormFieldsModule } from '@de-care/domains/purchase/ui-credit-card-form-fields';
// import { DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule } from '@de-care/domains/purchase/ui-service-address-same-as-billing-checkbox';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, withTranslation, MOCK_NGRX_STORE_PROVIDER, MOCK_BIN_RANGES_TOKEN_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { CreditCards } from '@de-care/shared/legacy-core/core-constants';
// import { EnterYourInformationComponent } from './enter-your-information.component';
// import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
// import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';
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
// const stories = storiesOf('roll-to-drop/enter-your-information', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [
//                 CustomerInfoModule,
//                 TranslateModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 DomainsAccountUiNewAccountFormFieldsModule,
//                 DomainsPurchaseUiTrialFollowOnFormFieldModule,
//                 DomainsPurchaseUiCreditCardFormFieldsModule,
//                 DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule,
//                 SharedSxmUiUiAddressFormFieldsModule,
//                 DomainsPaymentUiPrepaidRedeemModule
//             ]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: EnterYourInformationComponent,
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
//                 customerInfo: { email: 'test@siriusxm.com' },
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
