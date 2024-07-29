// TODO: STORYBOOK_AUDIT

// import { DataIdentityService } from '@de-care/data-services';
// import { IdentificationModule } from '../identification.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { AccountLookupFormComponent } from './account-lookup-form.component';
//
// const stories = storiesOf('identification/account-lookup-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: AccountLookupFormComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataIdentityService,
//                 useValue: {
//                     lookupCustomerEmail: (value: { email: string }) => {
//                         return value.email === 'a@a.com'
//                             ? of([
//                                   {
//                                       status: 'Active',
//                                       plans: [
//                                           {
//                                               code: 'Sponsored - OEM Trial - ALL ACCESS - 12mo - 116.55',
//                                               packageName: 'SIR_AUD_ALLACCESS',
//                                               termLength: '12',
//                                               endDate: '2020-11-01T00:00:00-04:00',
//                                               type: 'TRIAL'
//                                           }
//                                       ],
//                                       followonPlans: [],
//                                       radioService: {
//                                           last4DigitsOfRadioId: '2610',
//                                           vehicleInfo: {
//                                               model: null,
//                                               make: null,
//                                               year: null
//                                           }
//                                       },
//                                       streamingService: {
//                                           status: 'Active',
//                                           randomCredentials: false
//                                       }
//                                   }
//                               ])
//                             : of([]);
//                     }
//                 }
//             }
//         ],
//         imports: [IdentificationModule]
//     },
//     props: {
//         stepComplete: action('@Output stepComplete emitted')
//     }
// }));
