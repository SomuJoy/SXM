// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { boolean, text, withKnobs } from '@storybook/addon-knobs';
// import { withA11y } from '@storybook/addon-a11y';
// import { DomainsAccountUiLoginFormFieldsModule } from '../domains-account-ui-login-form-fields.module';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { DataValidationService } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
//
// const stories = storiesOf('domains/account/login-form-fields', module)
//     .addDecorator(withKnobs)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiLoginFormFieldsModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// const formGroup = new FormGroup({});
// stories.add('default', () => ({
//     template: `
//         <form [formGroup]="formGroup">
//             <login-form-fields
//                 [formInfo]="formInfo"
//             ></login-form-fields>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [{ provide: DataValidationService, useValue: { validatePassword: () => of({ valid: true }) } }]
//     },
//     props: {
//         formGroup: formGroup,
//         formInfo: {
//             email: text('@Input() formInfo.email', 'john.wick@siriusxm.com'),
//             parentForm: formGroup,
//             canEditEmail: boolean('@Input() formInfo.canEditEmail', true)
//         }
//     }
// }));
//
// stories.add('default: in Canada', () => ({
//     template: `
//         <form [formGroup]="formGroup">
//             <login-form-fields
//                 [formInfo]="formInfo"
//             ></login-form-fields>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [
//             { provide: DataValidationService, useValue: { validatePassword: () => of({ valid: true }) } },
//             { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//             UserSettingsService
//         ]
//     },
//     props: {
//         formGroup: formGroup,
//         formInfo: {
//             email: text('@Input() formInfo.email', 'john.wick@siriusxm.com'),
//             parentForm: formGroup,
//             canEditEmail: boolean('@Input() formInfo.canEditEmail', true)
//         }
//     }
// }));
