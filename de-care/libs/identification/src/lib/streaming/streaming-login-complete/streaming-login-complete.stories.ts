// TODO: STORYBOOK_AUDIT

// import { object } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { DataOfferService } from '@de-care/data-services';
// import { IDENTIFICATION_STORYBOOK_STORIES } from '../../identification.stories';
// import { of } from 'rxjs';
// import { StreamingLoginCompleteComponent } from './streaming-login-complete.component';
//
// const mockPackageDescriptionsProvider = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'en_US') {
//                 return of([
//                     {
//                         name: 'SiriusXM Select',
//                         packageName: 'SXM_SIR_AUD_EVT'
//                     },
//                     {
//                         name: 'Sirius All Access',
//                         packageName: 'SIR_AUD_ALLACCESS'
//                     },
//                     {
//                         name: 'Sirius Select',
//                         packageName: 'SIR_AUD_EVT'
//                     }
//                 ]);
//             } else if (locale === 'fr_CA') {
//                 return of([
//                     {
//                         name: 'FR:: SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS'
//                     }
//                 ]);
//             }
//         }
//     }
// };
//
// IDENTIFICATION_STORYBOOK_STORIES.add('streaming-login-complete', () => ({
//     component: StreamingLoginCompleteComponent,
//     moduleMetadata: {
//         providers: [mockPackageDescriptionsProvider]
//     },
//     props: {
//         subscriptions: object('subscriptions', [
//             {
//                 packageName: 'SXM_SIR_AUD_EVT',
//                 vehicleInfo: { year: '2014', make: 'Kia', model: 'Optima' },
//                 last4DigitsOfRadioId: '0011',
//                 allowedAction: 'SIGN_IN'
//             },
//             {
//                 packageName: 'SIR_AUD_ALLACCESS',
//                 vehicleInfo: { year: '2016', make: 'Mazda', model: '3' },
//                 last4DigitsOfRadioId: '4194',
//                 allowedAction: 'CREATE_LOGIN'
//             },
//             {
//                 packageName: 'SXM_SIR_AUD_EVT',
//                 vehicleInfo: { year: '2017', make: 'Ford', model: 'Focus' },
//                 last4DigitsOfRadioId: '0375',
//                 allowedAction: 'UPGRADE'
//             }
//         ]),
//         createLoginRequested: action('createLoginRequested'),
//         signInRequested: action('signInRequested'),
//         upgradeRequested: action('upgradeRequested'),
//         getAppRequested: action('getAppRequested')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('streaming-login-complete: no subscriptions', () => ({
//     component: StreamingLoginCompleteComponent,
//     props: {
//         subscriptions: null,
//         getAppRequested: action('getAppRequested')
//     }
// }));
