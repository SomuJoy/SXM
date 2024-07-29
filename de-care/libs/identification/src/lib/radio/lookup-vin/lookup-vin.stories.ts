// TODO: STORYBOOK_AUDIT

// import { DataAccountService, DataDevicesService } from '@de-care/data-services';
// import { LookupVinComponent } from './lookup-vin.component';
//
// import { IDENTIFICATION_STORYBOOK_STORIES } from '../../identification.stories';
// import { action } from '@storybook/addon-actions';
//
// import { of, throwError } from 'rxjs';
// import { MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER, MOCK_DATA_LAYER_PROVIDER } from '@de-care/shared/storybook/util-helpers';
//
// IDENTIFICATION_STORYBOOK_STORIES.add('lookup-vin', () => ({
//     component: LookupVinComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataDevicesService, useValue: { validate: () => of({ last4DigitsOfRadioId: '1234' }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             { provide: DataAccountService, useValue: { radio: () => of({ subscriptions: [] }), accountHasActiveSubscription: () => false } },
//             MOCK_DATA_LAYER_PROVIDER,
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         selectedRadio: action('@Output() selectedRadio'),
//         selectedAccount: action('@Output() selectedAccount'),
//         vinError: action('@Output() vinError'),
//         activeSubscriptionFound: action('@Output() activeSubscriptionFound')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('lookup-vin: not found', () => ({
//     component: LookupVinComponent,
//     moduleMetadata: {
//         providers: [{ provide: DataDevicesService, useValue: { validate: () => throwError({}) } }, MOCK_DATA_LAYER_PROVIDER, MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER]
//     },
//     props: {
//         selectedRadio: action('@Output() selectedRadio'),
//         selectedAccount: action('@Output() selectedAccount'),
//         vinError: action('@Output() vinError'),
//         activeSubscriptionFound: action('@Output() activeSubscriptionFound')
//     }
// }));
