// TODO: STORYBOOK_AUDIT

// import { action } from '@storybook/addon-actions';
// import { of } from 'rxjs';
// import { DataValidationService } from '@de-care/data-services';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { text, withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { AccountFormStepComponent } from './account-form-step.component';
// import { TrialActivationModule } from '../../trial-activation.module';
//
// const stories = storiesOf('trial-activation/account-form-step', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TrialActivationModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: AccountFormStepComponent,
//     moduleMetadata: {
//         imports: [SxmUiModule],
//         providers: [
//             {
//                 provide: DataValidationService,
//                 useValue: { validateUserName: () => of({ valid: true }) }
//             }
//         ]
//     },
//     props: {
//         username: text('@Input() username', 'test@test.com'),
//         accountFormSubmit: action('@Output() submitted emitted')
//     }
// }));
