// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { DomainsAccountUiTwoFactorAuthModule } from '../domains-account-ui-two-factor-auth.module';
// import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { TwoFactorAuthData } from './two-factor-auth-modal.component';
// import { action } from '@storybook/addon-actions';
// import { StoreModule } from '@ngrx/store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { EffectsModule } from '@ngrx/effects';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
//
// const stories = storiesOf('Domains/Account/Two Factor Auth/TwoFactorAuthModal', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [
//                 HttpClientTestingModule,
//                 StoreModule.forRoot({}),
//                 EffectsModule.forRoot([]),
//                 StoreDevtoolsModule.instrument({ maxAge: 25 }),
//                 DomainsAccountUiTwoFactorAuthModule
//             ],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings);
//
// stories.add('default (starts closed)', () => ({
//     template: `
//         <a (click)="tfa.start(data)">Verify</a>
//         <two-factor-auth-modal #tfa (verifyCompleted)="onVerifyCompleted()"></two-factor-auth-modal>
//     `,
//     props: {
//         data: {
//             verifyOptionsInfo: {
//                 maskedEmail: '****holt@siriusxm.com',
//                 maskedPhoneNumber: 'xxx-xxx-6504',
//                 canUseRadioId: true,
//                 canUseAccountNumber: true
//             }
//         } as TwoFactorAuthData,
//         onVerifyCompleted: action('@Output() verifyCompleted')
//     }
// }));
