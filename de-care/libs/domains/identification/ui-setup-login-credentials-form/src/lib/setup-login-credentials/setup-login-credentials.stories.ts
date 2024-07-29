// TODO: STORYBOOK_AUDIT

// import { DataValidationService } from '@de-care/data-services';
// import { UpdateStreamingCredentialsService } from '@de-care/domains/account/state-account';
// import { SettingsService } from '@de-care/settings';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of, throwError, timer } from 'rxjs';
// import { concatMap } from 'rxjs/operators';
// import { DomainsIdentificationUiSetupLoginCredentialsFormModule } from '../domains-identification-ui-setup-login-credentials-form.module';
// import { SetupLoginCredentialsComponent } from './setup-login-credentials.component';
//
// const stories = storiesOf('domains/identification/setup-login-credentials', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsIdentificationUiSetupLoginCredentialsFormModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 {
//                     provide: DataValidationService,
//                     useValue: { validateUserName: () => of({ valid: true }), validatePassword: () => of({ valid: true }) }
//                 },
//                 { provide: SettingsService, useValue: { settings: { country: 'us', apiUrl: '', apiPath: '' } } },
//                 { provide: UpdateStreamingCredentialsService, useValue: { build: () => timer(1000).pipe(concatMap(() => of(true))) } }
//             ]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: SetupLoginCredentialsComponent,
//     props: {
//         credentialsCreated: action('@Output() credentialsCreated emitted')
//     }
// }));
//
// stories.add('with privacy policy link hidden', () => ({
//     component: SetupLoginCredentialsComponent,
//     props: {
//         hidePrivacyPolicyLink: true,
//         credentialsCreated: action('@Output() credentialsCreated emitted')
//     }
// }));
//
// stories.add('with custom submit button text', () => ({
//     component: SetupLoginCredentialsComponent,
//     props: {
//         submitButtonTextOverride: 'Custom Button Text',
//         credentialsCreated: action('@Output() credentialsCreated emitted')
//     }
// }));
//
// stories.add('with submit failure', () => ({
//     component: SetupLoginCredentialsComponent,
//     moduleMetadata: {
//         providers: [{ provide: UpdateStreamingCredentialsService, useValue: { build: () => timer(1000).pipe(concatMap(() => throwError('error'))) } }]
//     },
//     props: {
//         credentialsCreated: action('@Output() credentialsCreated emitted')
//     }
// }));
