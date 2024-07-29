// TODO: STORYBOOK_AUDIT

// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { Router, ActivatedRoute } from '@angular/router';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { TrialActivationModule } from '../../trial-activation.module';
// import { TrialActivationThankYouComponent } from './trial-activation-thank-you.component';
// import { SweepstakesModule } from '@de-care/sweepstakes';
// import { DataRegisterService, DataUtilityService, DataValidationService, DataDevicesService, DataSweepstakesService, SweepstakesSubmitStatus } from '@de-care/data-services';
// import { SharedEventTrackService } from '@de-care/data-layer';
//
// const mockSecurityQuestions: { id: number; question: string }[] = [
//     { id: 1, question: 'favorite dog' },
//     { id: 2, question: 'favorite cat' },
//     { id: 3, question: 'favorite bird' }
// ];
//
// const stories = storiesOf('trial-activation/pages/trial-activation-thank-you', module)
//     .addDecorator(withKnobs)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TrialActivationModule, SweepstakesModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 MOCK_DATA_LAYER_PROVIDER,
//                 { provide: Router, useValue: { events: of({}) } },
//                 { provide: DataRegisterService, useValue: { registerAccount: () => of({ status: 'SUCCESS' }) } },
//                 { provide: DataUtilityService, useValue: { securityQuestions: () => of(mockSecurityQuestions) } },
//                 { provide: DataValidationService, useValue: { validateUserName: () => of(true) } },
//                 { provide: DataDevicesService, useValue: { refresh: () => of({}), sendRefreshInstruction: () => of({}) } },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } },
//                 { provide: UserSettingsService, useClass: UserSettingsService }, // revert changes in `withMockSettings` below
//                 {
//                     provide: ActivatedRoute,
//                     useValue: {
//                         data: of({
//                             securityQuestions: mockSecurityQuestions,
//                             flowData: {
//                                 email: 'abc@siriusxm.com',
//                                 isEligibleForRegistration: true,
//                                 trialEndDate: new Date('10/01/2021').toISOString(),
//                                 isOfferStreamingEligible: true,
//                                 sweepstakesInfo: null
//                             }
//                         })
//                     }
//                 },
//                 {
//                     provide: DataSweepstakesService,
//                     useValue: { sweepstakesRegister: () => of({ status: SweepstakesSubmitStatus.SUCCESS }) }
//                 }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: TrialActivationThankYouComponent,
//     moduleMetadata: {
//         providers: []
//     }
// }));
//
// stories.add('Canada - EN', () => ({
//     component: TrialActivationThankYouComponent,
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true } }]
//     }
// }));
//
// stories.add('Canada- FR', () => ({
//     component: TrialActivationThankYouComponent,
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true } }]
//     }
// }));
// stories.add('with sweepstakes', () => ({
//     component: TrialActivationThankYouComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: ActivatedRoute,
//                 useValue: {
//                     data: of({
//                         securityQuestions: mockSecurityQuestions,
//                         flowData: {
//                             email: 'abc@siriusxm.com',
//                             isEligibleForRegistration: true,
//                             trialEndDate: new Date('10/01/2021').toISOString(),
//                             isOfferStreamingEligible: true,
//                             sweepstakesInfo: { id: 'sweep1', officialRulesUrl: 'https://siriusxm.com' }
//                         }
//                     })
//                 }
//             }
//         ]
//     }
// }));
