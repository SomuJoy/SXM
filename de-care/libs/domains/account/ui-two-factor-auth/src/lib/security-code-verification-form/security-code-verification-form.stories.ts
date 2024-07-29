// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { DomainsAccountUiTwoFactorAuthModule } from '../domains-account-ui-two-factor-auth.module';
// import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { SecurityCodeVerificationFormComponent } from './security-code-verification-form.component';
// import { action } from '@storybook/addon-actions';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
//
// const stories = storiesOf('Domains/Account/Two Factor Auth/SecurityCodeVerificationForm', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [HttpClientTestingModule, StoreModule.forRoot({}), EffectsModule.forRoot([]), DomainsAccountUiTwoFactorAuthModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings);
//
// stories.add('default', () => ({
//     component: SecurityCodeVerificationFormComponent,
//     props: {
//         securityCodeSubmitted: action('@Output() completed'),
//         resendCodeRequest: action('@Output() resendCodeRequest')
//     }
// }));
//
// stories.add('custom resend code link text', () => ({
//     component: SecurityCodeVerificationFormComponent,
//     props: {
//         resendCodeLinkText: 'Resend Email',
//         securityCodeSubmitted: action('@Output() completed'),
//         resendCodeRequest: action('@Output() resendCodeRequest')
//     }
// }));
//
// stories.add('hide resend link', () => ({
//     component: SecurityCodeVerificationFormComponent,
//     props: {
//         resendCodeLinkText: 'Resend Email',
//         securityCodeSubmitted: action('@Output() completed'),
//         resendCodeRequest: action('@Output() resendCodeRequest'),
//         showResendLink: false
//     }
// }));
