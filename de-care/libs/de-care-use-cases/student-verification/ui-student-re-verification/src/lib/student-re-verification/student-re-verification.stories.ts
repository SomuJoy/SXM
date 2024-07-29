// TODO: STORYBOOK_AUDIT

// import { DeCareUseCasesStudentVerificationUiStudentReVerificationModule } from './../de-care-use-cases-student-verification-ui-student-re-verification.module';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, TRANSLATE_PROVIDERS_CA, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { StudentReVerificationComponent, StudentReVerificationData } from './student-re-verification.component';
// import { SettingsService } from '@de-care/settings';
//
// const testDataEN: StudentReVerificationData = {
//     programCode: 'test',
//     redirectUrl: '',
//     tkn: '',
//     langPref: 'en'
// };
//
// const testDataFR: StudentReVerificationData = {
//     programCode: 'test',
//     redirectUrl: '',
//     tkn: '',
//     langPref: 'fr'
// };
//
// const stories = storiesOf('de-care-use-cases/student-verification/ui-student-re-verification/student-re-verification', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesStudentVerificationUiStudentReVerificationModule]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withMockSettings);
//
// stories.add('default', () => ({
//     component: StudentReVerificationComponent,
//     props: {
//         studentReVerificationData: testDataEN
//     }
// }));
//
// stories.add('in Canada', () => ({
//     component: StudentReVerificationComponent,
//     moduleMetadata: {
//         providers: [...TRANSLATE_PROVIDERS_CA, { provide: SettingsService, useValue: { isCanadaMode: true } }]
//     },
//     props: {
//         studentReVerificationData: testDataEN
//     }
// }));
//
// stories.add('in Canada French', () => ({
//     component: StudentReVerificationComponent,
//     moduleMetadata: {
//         providers: [...TRANSLATE_PROVIDERS_CA, { provide: SettingsService, useValue: { isCanadaMode: true } }]
//     },
//     props: {
//         studentReVerificationData: testDataFR
//     }
// }));
