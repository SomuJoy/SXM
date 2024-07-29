// TODO: STORYBOOK_AUDIT

// import { DomainsAccountUiLoginModule } from '../domains-account-ui-login.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withMockSettings, TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { LoginFormComponent } from './login-form.component';
// import { AuthenticationWorkflowService } from '@de-care/domains/account/state-login';
// import { of, throwError } from 'rxjs';
// import { action } from '@storybook/addon-actions';
//
// function createMockAuthenticationWorkflowService(authenticate) {
//     return { provide: AuthenticationWorkflowService, useValue: { authenticate } };
// }
//
// const stories = storiesOf('domains/account/ui-login', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiLoginModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
//         })
//     )
//     .addDecorator(withMockSettings);
//
// stories.add('login-form', () => ({
//     moduleMetadata: {
//         providers: [createMockAuthenticationWorkflowService(() => of({ accountNum: '1000', refreshToken: '' }))],
//     },
//     component: LoginFormComponent,
//     props: {
//         fetchedAccountNumber: action('@Output() fetchedAccountNumber'),
//         hasKeepSignedInOption: boolean('@Input hasKeepSignedInOption', true),
//     },
// }));
//
// stories.add('login-form: failed login', () => ({
//     moduleMetadata: {
//         providers: [createMockAuthenticationWorkflowService(() => throwError({}))],
//     },
//     component: LoginFormComponent,
//     props: {
//         fetchedAccountNumber: action('@Output() fetchedAccountNumber'),
//     },
// }));
