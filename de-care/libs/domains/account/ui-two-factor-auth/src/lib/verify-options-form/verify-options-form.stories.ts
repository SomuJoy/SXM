// TODO: STORYBOOK_AUDIT

// import { ChatProviderToken } from '@de-care/domains/chat/ui-chat-with-agent-link';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { DomainsAccountUiTwoFactorAuthModule } from '../domains-account-ui-two-factor-auth.module';
// import { VerifyOptions, VerifyOptionsFormComponent } from './verify-options-form.component';
// import { TRANSLATE_PROVIDERS, TRANSLATE_PROVIDERS_CA, TRANSLATE_PROVIDERS_CA_FR, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { action } from '@storybook/addon-actions';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
//
// const stories = storiesOf('Domains/Account/Two Factor Auth/VerifyOptionsForm', module)
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
// const verifyTypeSelected = action('@Output() verifyTypeSelected');
//
// stories.add('all options', () => ({
//     component: VerifyOptionsFormComponent,
//     props: {
//         options: {
//             maskedEmail: '****holt@siriusxm.com',
//             maskedPhoneNumber: 'xxx-xxx-6504',
//             canUseRadioId: true,
//             canUseAccountNumber: true
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
//
// stories.add('email only', () => ({
//     component: VerifyOptionsFormComponent,
//     props: {
//         options: {
//             maskedEmail: '****holt@siriusxm.com'
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
//
// stories.add('text message only', () => ({
//     component: VerifyOptionsFormComponent,
//     props: {
//         options: {
//             maskedPhoneNumber: 'xxx-xxx-6504'
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
//
// stories.add('no radio id option', () => ({
//     component: VerifyOptionsFormComponent,
//     props: {
//         options: {
//             maskedEmail: '****holt@siriusxm.com',
//             maskedPhoneNumber: 'xxx-xxx-6504',
//             canUseAccountNumber: true
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
//
// stories.add('no account number option', () => ({
//     component: VerifyOptionsFormComponent,
//     props: {
//         options: {
//             maskedEmail: '****holt@siriusxm.com',
//             maskedPhoneNumber: 'xxx-xxx-6504',
//             canUseRadioId: true
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
//
// const chatProvider247 = {
//     provide: ChatProviderToken,
//     useValue: '247'
// };
// stories.add('with chat link', () => ({
//     component: VerifyOptionsFormComponent,
//     moduleMetadata: {
//         providers: [chatProvider247]
//     },
//     props: {
//         options: {
//             canUseAccountNumber: true,
//             includeChatWithAgentLink: true
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
// stories.add('with chat link in Canada', () => ({
//     component: VerifyOptionsFormComponent,
//     moduleMetadata: {
//         providers: [chatProvider247, ...TRANSLATE_PROVIDERS_CA]
//     },
//     props: {
//         options: {
//             canUseAccountNumber: true,
//             includeChatWithAgentLink: true
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
// stories.add('with chat link in Canada French', () => ({
//     component: VerifyOptionsFormComponent,
//     moduleMetadata: {
//         providers: [chatProvider247, ...TRANSLATE_PROVIDERS_CA_FR]
//     },
//     props: {
//         options: {
//             canUseAccountNumber: true,
//             includeChatWithAgentLink: true
//         } as VerifyOptions,
//         verifyTypeSelected
//     }
// }));
