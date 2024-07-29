// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { boolean, object, withKnobs } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { of, throwError } from 'rxjs';
// import {
//     MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER,
//     MOCK_DATA_LAYER_PROVIDER,
//     MOCK_NGRX_STORE_PROVIDER,
//     withCommonDependencies,
//     withTranslation,
//     withMockSettings
// } from '@de-care/shared/storybook/util-helpers';
// import { IdentificationModule } from './identification.module';
// import { AccountVerify, DataAccountService, DataDevicesService, DataIdentityService, DataOfferService, VehicleModel } from '@de-care/data-services';
// import { RadioNoMatchComponent } from './flepz/radio-no-match/radio-no-match.component';
// import { FlepzFormComponent } from './flepz/flepz-form/flepz-form.component';
// import { RadioLookupOptionsComponent } from './flepz/radio-lookup-options/radio-lookup-options.component';
// import { LookupRadioIdComponent } from './radio/lookup-radio-id/lookup-radio-id.component';
//
// import { LookupLicensePlateComponent } from './radio/lookup-license-plate/lookup-license-plate.component';
// import { ConfirmVinComponent, ConfirmVinInputData } from './radio/confirm-vin/confirm-vin.component';
//
// import { SettingsService } from '@de-care/settings';
// import { MarketingPromoCodeComponent } from './flepz/marketing-promo-code/marketing-promo-code.component';
// import { ActivatedRoute, convertToParamMap } from '@angular/router';
// import { SharedEventTrackService } from '@de-care/data-layer';
//
// export const IDENTIFICATION_STORYBOOK_STORIES = storiesOf('identification', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule],
//             providers: [
//                 { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } },
//                 { provide: SettingsService, useValue: { settings: { country: 'us', apiUrl: '', apiPath: '' } } }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// IDENTIFICATION_STORYBOOK_STORIES.add('radio-no-match', () => ({
//     component: RadioNoMatchComponent,
//     props: {
//         last4DigitsOfRadioId: '1234',
//         vehicleInfo: object('@Input() vehicleInfo', { year: '2014', make: 'Honda', model: 'Accord' } as VehicleModel),
//         userVerifyData: object('@Input() userVerifyInfo', { lastName: 'Smith', phoneNumber: '8884442222', zipCode: '99999' } as AccountVerify),
//         editInfo: action('@Output() editInfo'),
//         createNewAccount: action('@Output() createNewAccount')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('radio-lookup-options', () => ({
//     component: RadioLookupOptionsComponent,
//     props: {
//         selectedModal: action('@Output() selectedModal')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('flepz-form', () => ({
//     component: FlepzFormComponent,
//     moduleMetadata: {
//         providers: [{ provide: DataIdentityService, useValue: { customerFlepz: of({}) } }, MOCK_DATA_LAYER_PROVIDER, MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER]
//     },
//     props: {
//         flepzNoRadios: boolean('@Input() flepzNoRadios', false),
//         selectedFlepzInfo: action('@Output() selectedFlepzInfo'),
//         dontSeeYourRadio: action('@Output() dontSeeYourRadio')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('lookup-radio-id', () => ({
//     component: LookupRadioIdComponent,
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
//         activeSubscriptionFound: action('@Output() activeSubscriptionFound'),
//         noAccountFound: action('@Output() noAccountFound'),
//         deviceHelp: action('@Output() deviceHelp')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('lookup-radio-id: not found', () => ({
//     component: LookupRadioIdComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataDevicesService, useValue: { validate: () => throwError({ status: 400 }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             MOCK_DATA_LAYER_PROVIDER,
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         selectedRadio: action('@Output() selectedRadio'),
//         selectedAccount: action('@Output() selectedAccount'),
//         activeSubscriptionFound: action('@Output() activeSubscriptionFound'),
//         noAccountFound: action('@Output() noAccountFound'),
//         deviceHelp: action('@Output() deviceHelp')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('lookup-license-plate', () => ({
//     component: LookupLicensePlateComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataIdentityService, useValue: { deviceLicencePlate: () => of({}) } },
//             { provide: DataDevicesService, useValue: { validate: () => of({ last4DigitsOfRadioId: '1234' }), info: () => of({ deviceInformation: { vehicle: null } }) } },
//             { provide: DataAccountService, useValue: { radio: () => of({ subscriptions: [] }), accountHasActiveSubscription: () => false } },
//             MOCK_DATA_LAYER_PROVIDER,
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         selectedVin: action('@Output() selectedVin'),
//         licensePlateError: action('@Output() licensePlateError'),
//         activeSubscriptionFound: action('@Output() activeSubscriptionFound')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('lookup-license-plate: not found', () => ({
//     component: LookupLicensePlateComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataIdentityService, useValue: { deviceLicencePlate: () => throwError({}) } },
//             MOCK_DATA_LAYER_PROVIDER,
//             MOCK_DATA_IDENTITY_REQUEST_STORE_PROVIDER
//         ]
//     },
//     props: {
//         selectedVin: action('@Output() selectedVin'),
//         licensePlateError: action('@Output() licensePlateError'),
//         activeSubscriptionFound: action('@Output() activeSubscriptionFound')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('confirm-vin', () => ({
//     component: ConfirmVinComponent,
//     props: {
//         data: object('@Input() data', {
//             vinNumber: '3425',
//             state: 'CA',
//             licensePlate: 'STRY100',
//             last4DigitsOfRadioId: '1234',
//             vehicleInfo: null
//         } as ConfirmVinInputData),
//         vinConfirmed: action('@Output() vinConfirmed'),
//         tryAgainEvent: action('@Output() tryAgainEvent')
//     }
// }));
//
// IDENTIFICATION_STORYBOOK_STORIES.add('marketing-promo-code: in Canada', () => ({
//     component: MarketingPromoCodeComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataIdentityService,
//                 useValue: { radio: () => of({}) }
//             },
//             //this comp is create only for Canada
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             MOCK_NGRX_STORE_PROVIDER,
//             MOCK_DATA_LAYER_PROVIDER,
//             { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]), validatePromoCode: () => of({ status: 'SUCCESS' }) } },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             {
//                 provide: ActivatedRoute,
//                 useValue: {
//                     snapshot: {
//                         queryParamMap: convertToParamMap({ programcode: 'programCode' })
//                     }
//                 }
//             }
//         ]
//     },
//     props: {}
// }));
