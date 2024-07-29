// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { TRANSLATE_PROVIDERS, withTranslation, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { DomainsAccountUiRegisterModule } from './domains-account-ui-register.module';
//
// const stories = storiesOf('register', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiRegisterModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// // stories.add('register-your-account', () => ({
// //     component: SharedRegisterYourAccountComponent,
// //     moduleMetadata: {
// //         providers: [MOCK_DATA_LAYER_PROVIDER, { provide: Store, useValue: { dispatch: () => {} } }]
// //     },
// //     props: {
// //         registrationCompleted: boolean('registrationCompleted', false),
// //         account: object('account', {
// //             planCode: 'Sirius select',
// //             email: 'test@test.com'
// //         }),
// //         securityQuestions: [{ id: 1, question: 'favorite dog' }, { id: 2, question: 'favorite cat' }, { id: 3, question: 'favorite bird' }]
// //     }
// // }));
