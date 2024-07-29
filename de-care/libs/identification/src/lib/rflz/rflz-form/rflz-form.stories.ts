// TODO: STORYBOOK_AUDIT

// import { DataAccountService, DataDevicesService, DataTrialService } from '@de-care/data-services';
// import { IdentificationModule } from '../../identification.module';
// import { SettingsService } from '@de-care/settings';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of, throwError } from 'rxjs';
// import {
//     MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER,
//     MOCK_DATA_LAYER_PROVIDER,
//     TRANSLATE_PROVIDERS,
//     withMockSettings,
//     withTranslation
// } from '@de-care/shared/storybook/util-helpers';
// import { RflzFormComponent } from './rflz-form.component';
// import { SharedEventTrackService } from '@de-care/data-layer';
//
// const stories = storiesOf('identification/rflz-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, { provide: SharedEventTrackService, useValue: { track: () => {} } }]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: RflzFormComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataDevicesService, useValue: { validate: () => of({ last4DigitsOfRadioId: '1234' }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             {
//                 provide: DataTrialService,
//                 useValue: {
//                     usedCarEligibilityCheck: () =>
//                         of({
//                             errorMessage: '',
//                             usedCarBrandingType: 'SXM',
//                             success: true
//                         })
//                 }
//             },
//             { provide: DataAccountService, useValue: { radio: () => of({ subscriptions: [] }), accountHasActiveSubscription: () => false } },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         foundRadio: action('@Output() foundRadio'),
//         helpFindRadio: action('@Output() helpFindRadio')
//     }
// }));
// stories.add('default: in Canada', () => ({
//     component: RflzFormComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//             {
//                 provide: DataTrialService,
//                 useValue: {
//                     usedCarEligibilityCheck: () =>
//                         of({
//                             errorMessage: '',
//                             usedCarBrandingType: 'SXM',
//                             success: true
//                         })
//                 }
//             },
//             { provide: DataAccountService, useValue: { radio: () => of({ subscriptions: [] }), accountHasActiveSubscription: () => false } },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         foundRadio: action('@Output() foundRadio'),
//         helpFindRadio: action('@Output() helpFindRadio')
//     }
// }));
// stories.add('default: radio or vin lookup failure', () => ({
//     component: RflzFormComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataDevicesService, useValue: { validate: () => of({ last4DigitsOfRadioId: '1234' }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             {
//                 provide: DataTrialService,
//                 useValue: {
//                     usedCarEligibilityCheck: () =>
//                         of({
//                             errorMessage: '101',
//                             usedCarBrandingType: '',
//                             success: false
//                         })
//                 }
//             },
//             { provide: DataAccountService, useValue: { radio: () => throwError({}) } },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         foundRadio: action('@Output() foundRadio'),
//         helpFindRadio: action('@Output() helpFindRadio')
//     }
// }));
// stories.add('default: radio or vin lookup failure: in Canada', () => ({
//     component: RflzFormComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//             { provide: DataDevicesService, useValue: { validate: () => throwError({}) } },
//             {
//                 provide: DataTrialService,
//                 useValue: {
//                     usedCarEligibilityCheck: () =>
//                         of({
//                             errorMessage: '3494',
//                             usedCarBrandingType: '',
//                             success: false
//                         })
//                 }
//             },
//             { provide: DataAccountService, useValue: { radio: () => throwError({}) } },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         foundRadio: action('@Output() foundRadio'),
//         helpFindRadio: action('@Output() helpFindRadio')
//     }
// }));
// stories.add('default: last 4 of radio from vin lookup failure', () => ({
//     component: RflzFormComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataDevicesService, useValue: { validate: () => of({ last4DigitsOfRadioId: '1234' }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             {
//                 provide: DataTrialService,
//                 useValue: {
//                     usedCarEligibilityCheck: () =>
//                         of({
//                             errorMessage: '3494',
//                             usedCarBrandingType: '',
//                             success: false
//                         })
//                 }
//             },
//             { provide: DataAccountService, useValue: { radio: () => throwError({}) } },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         foundRadio: action('@Output() foundRadio'),
//         helpFindRadio: action('@Output() helpFindRadio')
//     }
// }));
// stories.add('default: last 4 of radio from vin lookup failure: in Canada', () => ({
//     component: RflzFormComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//             { provide: DataDevicesService, useValue: { validate: () => of({ last4DigitsOfRadioId: '1234' }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             {
//                 provide: DataTrialService,
//                 useValue: {
//                     usedCarEligibilityCheck: () =>
//                         of({
//                             errorMessage: '3494',
//                             usedCarBrandingType: '',
//                             success: false
//                         })
//                 }
//             },
//             { provide: DataAccountService, useValue: { radio: () => throwError({}) } },
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         foundRadio: action('@Output() foundRadio'),
//         helpFindRadio: action('@Output() helpFindRadio')
//     }
// }));
