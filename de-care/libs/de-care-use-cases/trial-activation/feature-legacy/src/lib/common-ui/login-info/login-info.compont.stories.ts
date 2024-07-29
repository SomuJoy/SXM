// TODO: STORYBOOK_AUDIT

// import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { DataValidationService } from '@de-care/data-services';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { withA11y } from '@storybook/addon-a11y';
// import { boolean, text, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { TrialActivationModule } from '../../trial-activation.module';
//
// const stories = storiesOf('trial-activation/common-ui/login-info', module)
//     .addDecorator(withKnobs)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TrialActivationModule],
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
//             <login-info
//                 [formInfo]="formInfo"
//             ></login-info>
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
// stories.add('default: in Canada', () => ({
//     template: `
//         <form [formGroup]="formGroup">
//             <login-info
//                 [formInfo]="formInfo"
//             ></login-info>
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
