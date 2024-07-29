// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { SweepstakesModule } from '../sweepstakes.module';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SweepstakesRegistrationFormComponent, SweepstakesInfo } from './sweepstakes-registration-form.component';
// import { SweepstakesRegistrationFormService } from './sweepstakes-registration-form.service';
// import { of } from 'rxjs';
// import { SweepstakesSubmitStatus, DataSweepstakesService } from '@de-care/data-services';
//
// const SWEEPSTAKES_INFO: SweepstakesInfo = {
//     officialRulesUrl: 'https://www.siriusxm.com/R-U2InDublinSweeps7.11.18fnl',
//     radioId: 1234,
//     id: 'U2Dublin_071118'
// };
//
// const stories = storiesOf('sweepstakes/sweepstakesRegistrationFormComponent', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [SweepstakesModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: SweepstakesRegistrationFormComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SweepstakesRegistrationFormService,
//                 useValue: { enterSweepstakes: () => of({ status: SweepstakesSubmitStatus.SUCCESS }) }
//             },
//
//             {
//                 provide: DataSweepstakesService,
//                 useValue: { sweepstakesRegister: () => of({ status: SweepstakesSubmitStatus.SUCCESS }) }
//             }
//         ]
//     },
//     props: {
//         sweepstakesInfo: SWEEPSTAKES_INFO
//     }
// }));
//
// stories.add('invalid DOB', () => ({
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SweepstakesRegistrationFormService,
//                 useValue: { enterSweepstakes: () => of({ status: SweepstakesSubmitStatus.INVALID_DOB }) }
//             },
//             {
//                 provide: DataSweepstakesService,
//                 useValue: { sweepstakesRegister: () => of({ status: SweepstakesSubmitStatus.INVALID_DOB }) }
//             }
//         ]
//     },
//     component: SweepstakesRegistrationFormComponent,
//     props: {
//         sweepstakesInfo: SWEEPSTAKES_INFO
//     }
// }));
