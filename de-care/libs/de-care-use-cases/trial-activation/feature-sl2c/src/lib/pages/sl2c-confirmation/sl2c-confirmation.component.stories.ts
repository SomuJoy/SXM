// TODO: STORYBOOK_AUDIT

// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DeCareUseCasesTrialActivationSl2CConfirmationComponent } from './sl2c-confirmation.component';
// import { DeCareUseCasesTrialActivationFeatureSl2cModule } from '../../de-care-use-cases-trial-activation-feature-sl2c.module';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { of } from 'rxjs';
//
// const stories = storiesOf('de-care-use-cases/trial-activation/sl2c-confirmation', module)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesTrialActivationFeatureSl2cModule]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('default', () => ({
//     component: DeCareUseCasesTrialActivationSl2CConfirmationComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: false,
//                     dateFormat: 'MM/dd/y',
//                     settings: { country: 'us', apiUrl: '' }
//                 }
//             },
//             { provide: UserSettingsService, useValue: { isQuebec: () => false } }
//         ]
//     },
//     props: {
//         isQuebec$: of(false),
//         trialEndDate$: of(new Date('2020-10-30')),
//         dateFormat$: of('MM/dd/y'),
//         locale$: of('en-US'),
//         radioId$: of('4674')
//     }
// }));
// stories.add('Canada', () => ({
//     component: DeCareUseCasesTrialActivationSl2CConfirmationComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     dateFormat: 'MM/dd/y',
//                     settings: { country: 'ca', apiUrl: '' }
//                 }
//             },
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isQuebec: () => false,
//                     setProvinceSelectionVisible: () => false,
//                     language: 'en-CA'
//                 }
//             }
//         ]
//     },
//     props: {
//         isQuebec$: of(false),
//         trialEndDate$: of(new Date('2020-10-30')),
//         dateFormat$: of('MM/dd/y'),
//         locale$: of('en-CA'),
//         radioId$: of('4674')
//     }
// }));
