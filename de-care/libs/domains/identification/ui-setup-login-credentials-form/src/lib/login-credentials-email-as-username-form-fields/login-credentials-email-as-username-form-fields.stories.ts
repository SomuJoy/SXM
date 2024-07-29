// TODO: STORYBOOK_AUDIT

// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DataValidationService } from '@de-care/data-services';
// import { SettingsService } from '@de-care/settings';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { DomainsIdentificationUiSetupLoginCredentialsFormModule } from '../domains-identification-ui-setup-login-credentials-form.module';
//
// const stories = storiesOf('domains/identification/login-credentials-email-as-username', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [ReactiveFormsModule, DomainsIdentificationUiSetupLoginCredentialsFormModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 {
//                     provide: DataValidationService,
//                     useValue: { validateUserName: () => of({ valid: true }), validatePassword: () => of({ valid: true }) }
//                 },
//                 { provide: SettingsService, useValue: { settings: { country: 'us', apiUrl: '', apiPath: '' } } }
//             ]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     template: `
//         <form [formGroup]="form">
//             <login-credentials-email-as-username-form formControlName="credentials"></login-credentials-email-as-username-form>
//         </form>
//     `,
//     props: {
//         form: new FormGroup({
//             credentials: new FormControl()
//         })
//     }
// }));
