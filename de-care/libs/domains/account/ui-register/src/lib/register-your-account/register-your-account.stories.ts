// TODO: STORYBOOK_AUDIT

// import { boolean, object, withKnobs } from '@storybook/addon-knobs';
// import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { RegisterCredentialsState, SharedRegisterYourAccountComponent } from './register-your-account.component';
// import { AppSettings } from '@de-care/settings';
// import { DataOfferService, DataValidationService } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { action } from '@storybook/addon-actions';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { DomainsAccountUiRegisterModule } from '../domains-account-ui-register.module';
//
// const mockDataValidationService = { validateUserName: () => of({ valid: true }), validatePassword: () => of({ valid: true }) };
// const mockSecurityQuestions = [
//     { id: 1, question: 'favorite dog' },
//     { id: 2, question: 'favorite cat' },
//     { id: 3, question: 'favorite bird' }
// ];
//
// const stories = storiesOf('register/register-your-account', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiRegisterModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 MOCK_DATA_LAYER_PROVIDER,
//                 MOCK_NGRX_STORE_PROVIDER,
//                 { provide: AppSettings, useValue: {} },
//                 { provide: DataValidationService, useValue: mockDataValidationService },
//                 { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } }
//             ]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('State: All Credentials + Security Questions', () => ({
//     component: SharedRegisterYourAccountComponent,
//     props: {
//         registrationCompleted: boolean('registrationCompleted', false),
//         // suppressPassword: boolean('suppressPassword', false),
//         credentialState: object('credentialState', RegisterCredentialsState.All),
//         account: object('account', {
//             planCode: 'Sirius select',
//             email: 'test@test.com'
//         }),
//         register: action('@Output() register'),
//         submit: action('@Output() submit'),
//         registerClicked: action('@Output() registerClicked'),
//         securityQuestions: mockSecurityQuestions
//     }
// }));
//
// stories.add('State: All Credentials + No Security Questions', () => ({
//     component: SharedRegisterYourAccountComponent,
//     props: {
//         registrationCompleted: boolean('registrationCompleted', false),
//         // suppressPassword: boolean('suppressPassword', false),
//         credentialState: RegisterCredentialsState.All,
//         account: object('account', {
//             planCode: 'Sirius select',
//             email: 'test@test.com'
//         }),
//         register: action('@Output() register'),
//         submit: action('@Output() submit'),
//         registerClicked: action('@Output() registerClicked'),
//         securityQuestions: []
//     }
// }));
//
// stories.add('State: Security Questions Only', () => ({
//     component: SharedRegisterYourAccountComponent,
//     props: {
//         registrationCompleted: boolean('registrationCompleted', false),
//         // suppressPassword: boolean('suppressPassword', false),
//         credentialState: RegisterCredentialsState.None,
//         account: object('account', {
//             planCode: 'Sirius select',
//             email: 'test@test.com'
//         }),
//         register: action('@Output() register'),
//         registerClicked: action('@Output() registerClicked'),
//         securityQuestions: mockSecurityQuestions
//     }
// }));
//
// stories.add('State: Username + Security Questions Only', () => ({
//     component: SharedRegisterYourAccountComponent,
//     props: {
//         registrationCompleted: boolean('registrationCompleted', false),
//         // suppressPassword: boolean('suppressPassword', false),
//         credentialState: RegisterCredentialsState.UsernameOnly,
//         account: object('account', {
//             planCode: 'Sirius select',
//             email: 'test@test.com'
//         }),
//         register: action('@Output() register'),
//         registerClicked: action('@Output() registerClicked'),
//         securityQuestions: mockSecurityQuestions
//     }
// }));
//
// stories.add('State: Password + Security Questions Only', () => ({
//     component: SharedRegisterYourAccountComponent,
//     props: {
//         registrationCompleted: boolean('registrationCompleted', false),
//         // suppressPassword: boolean('suppressPassword', false),
//         credentialState: RegisterCredentialsState.PasswordOnly,
//         account: object('account', {
//             planCode: 'Sirius select',
//             email: 'test@test.com'
//         }),
//         register: action('@Output() register'),
//         registerClicked: action('@Output() registerClicked'),
//         securityQuestions: mockSecurityQuestions
//     }
// }));
