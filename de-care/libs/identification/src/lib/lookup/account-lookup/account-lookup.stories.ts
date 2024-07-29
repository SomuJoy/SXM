// TODO: STORYBOOK_AUDIT

// import { SharedEventTrackService } from '@de-care/data-layer';
// import { MOCK_DATA_LAYER_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { IDENTIFICATION_STORYBOOK_STORIES } from '../../identification.stories';
// import { AccountLookupComponent } from './account-lookup.component';
// import { action } from '@storybook/addon-actions';
// import { DataIdentityService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// IDENTIFICATION_STORYBOOK_STORIES.add('account-lookup', () => ({
//     component: AccountLookupComponent,
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
//             },
//             MOCK_DATA_LAYER_PROVIDER
//         ]
//     },
//     props: {
//         signIn: action('@Output signIn emitted'),
//         continue: action('@Output continue emitted')
//     }
// }));
