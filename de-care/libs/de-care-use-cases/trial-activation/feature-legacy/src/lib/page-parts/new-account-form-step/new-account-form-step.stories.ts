// TODO: STORYBOOK_AUDIT

// import { action } from '@storybook/addon-actions';
// import { of } from 'rxjs';
// import { DataValidationService, ProspectModel } from '@de-care/data-services';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { TrialActivationModule } from '../../trial-activation.module';
// import { NewAccountFormStepComponent } from './new-account-form-step.component';
//
// const stories = storiesOf('trial-activation/new-account-form-step', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TrialActivationModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('No Prospect data', () => ({
//     component: NewAccountFormStepComponent,
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
//         submitNewAccount: action('@Output() submitNewAccount emitted')
//     }
// }));
//
// stories.add('With Prospect Data Mode', () => ({
//     component: NewAccountFormStepComponent,
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
//         prospectData: {
//             firstName: 'Nando',
//             lastName: 'Man',
//             username: 'nandoman@siriusxm.com',
//             trialstartdate: '01/03/2020',
//             trialenddate: '12/24/2020',
//             promocode: 'AA3MOTRIALGGLE'
//         } as ProspectModel,
//         submitNewAccount: action('@Output() submitNewAccount emitted')
//     }
// }));
