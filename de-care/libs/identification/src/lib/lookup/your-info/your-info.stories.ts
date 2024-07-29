// TODO: STORYBOOK_AUDIT

// import { boolean, object } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { of } from 'rxjs';
// import { MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { DataAccountService, DataOfferService, PlanTypeEnum } from '@de-care/data-services';
// import { YourInfoComponent } from './your-info.component';
// import { IDENTIFICATION_STORYBOOK_STORIES } from '../../identification.stories';
//
// const mockSubscription = {
//     id: '100',
//     followonPlans: [],
//     plans: [
//         {
//             code: 'OEM Trial - Select - 6mo - 0.00',
//             endDate: '2019-12-24T00:00:00-05:00',
//             packageName: 'SIR_AUD_EVT',
//             descriptor: '',
//             termLength: 6,
//             startDate: '',
//             nextCycleOn: '',
//             type: PlanTypeEnum.Trial,
//             closedDevices: null
//         }
//     ],
//     radioService: {
//         id: '100009',
//         last4DigitsOfRadioId: '0009',
//         nickName: '',
//         endDate: null,
//         deviceStatus: 'active',
//         vehicleInfo: { year: 2019, make: 'Toyota', model: 'Tundra' }
//     }
// };
//
// IDENTIFICATION_STORYBOOK_STORIES.add('your-info', () => ({
//     component: YourInfoComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataAccountService,
//                 useValue: {
//                     radio: () => of({}),
//                     sanitizeVehicleInfo: () => {}
//                 }
//             },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: () => of([]),
//                     packageDescriptions: () => of({}),
//                     packageDescriptionsAsPackageNameMappings: () => of({})
//                 }
//             },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         isAccount: boolean('isAccount', true),
//         accountInfo: object('accountInfo', {
//             firstName: 'Jim',
//             lastName: 'Simmons',
//             email: 'j@s.com',
//             phoneNumber: '2223334444',
//             zipCode: '33014'
//         }),
//         subscriptions: object('subscriptions', [
//             mockSubscription,
//             {
//                 // self-paid, has vehicle info, no follow-on
//                 ...mockSubscription,
//                 plans: [
//                     {
//                         ...mockSubscription.plans[0],
//                         type: PlanTypeEnum.SelfPaid
//                     }
//                 ],
//                 id: 200,
//                 radioService: {
//                     ...mockSubscription.radioService,
//                     id: '100010',
//                     last4DigitsOfRadioId: '0010',
//                     vehicleInfo: { year: '2014', make: 'Kia', model: 'Optima' }
//                 }
//             },
//             {
//                 // trial, no vehicle info, has follow-on
//                 ...mockSubscription,
//                 followonPlans: [
//                     {
//                         code: 'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X',
//                         endDate: '2020-03-21T00:00:00-04:00',
//                         nextCycleOn: null,
//                         packageName: '1_SIR_AUD_EVT',
//                         startDate: null,
//                         termLength: 6,
//                         type: 'PROMO'
//                     }
//                 ],
//                 id: 300,
//                 radioService: {
//                     ...mockSubscription.radioService,
//                     id: '100011',
//                     last4DigitsOfRadioId: '0011',
//                     vehicleInfo: null
//                 }
//             }
//         ]),
//         closedRadios: object('closedRadios', [
//             {
//                 last4DigitsOfRadioId: '5105',
//                 closedDate: ''
//             }
//         ]),
//         editYourInfo: action('@Output() editYourInfo emitted'),
//         dontSeeYourRadio: action('@Output() dontSeeYourRadio emitted'),
//         selectedRadio: action('@Output() selectedRadio emitted'),
//         selectedAccount: action('@Output() selectedAccount emitted')
//     }
// }));
