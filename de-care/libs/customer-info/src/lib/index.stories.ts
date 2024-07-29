// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { object, withKnobs } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { TRANSLATE_PROVIDERS, withTranslation, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { HttpClientModule } from '@angular/common/http';
// import { of } from 'rxjs';
// import { DataPurchaseService } from '@de-care/data-services';
// import { CustomerInfoModule } from './customer-info.module';
// import { VerifyAddressComponent } from './verify-address/verify-address.component';
// import { AppSettings } from '@de-care/settings';
//
// export const CUSTOMER_INFO_STORYBOOK_STORIES = storiesOf('customer-info', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [HttpClientModule, CustomerInfoModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 { provide: AppSettings, useValue: { country: 'us' } },
//                 { provide: DataPurchaseService, useValue: { redeemPrepaidCard: () => of(), removePrepaidCard: () => of() } }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// CUSTOMER_INFO_STORYBOOK_STORIES.add('verify-address', () => ({
//     component: VerifyAddressComponent,
//     props: {
//         data: object('data', {
//             headingText: '',
//             currentAddress: {
//                 addressLine1: '200 Broad',
//                 city: 'Anytown',
//                 state: 'NY',
//                 zip: '99999'
//             },
//             correctedAddress: {
//                 addressLine1: '200 Broad Street Building C',
//                 city: 'Anytownship',
//                 state: 'NJ',
//                 zip: '88888'
//             }
//         }),
//         editExisting: action('Output() editExisting emitted'),
//         editAddress: action('Output() editAddress emitted')
//     }
// }));
// CUSTOMER_INFO_STORYBOOK_STORIES.add('verify-address: custom header text', () => ({
//     component: VerifyAddressComponent,
//     props: {
//         data: object('data', {
//             headingText: 'Is this the billing address you want?',
//             correctedAddress: {
//                 addressLine1: '11199 Bird Rd',
//                 city: 'Summerspot',
//                 state: 'FL',
//                 zip: '12345'
//             }
//         }),
//         editExisting: action('Output() editExisting emitted'),
//         editAddress: action('Output() editAddress emitted')
//     }
// }));
// CUSTOMER_INFO_STORYBOOK_STORIES.add('verify-address: no user entered', () => ({
//     component: VerifyAddressComponent,
//     props: {
//         data: object('data', {
//             headingText: '',
//             correctedAddress: {
//                 addressLine1: '11199 Bird Rd',
//                 city: 'Summerspot',
//                 state: 'FL',
//                 zip: '12345'
//             }
//         }),
//         editExisting: action('Output() editExisting emitted'),
//         editAddress: action('Output() editAddress emitted')
//     }
// }));
// CUSTOMER_INFO_STORYBOOK_STORIES.add('verify-address: no corrected suggestion', () => ({
//     component: VerifyAddressComponent,
//     props: {
//         data: object('data', {
//             headingText: '',
//             currentAddress: {
//                 addressLine1: '200 Broad',
//                 city: 'Anytown',
//                 state: 'NY',
//                 zip: '99999'
//             }
//         }),
//         editExisting: action('Output() editExisting emitted'),
//         editAddress: action('Output() editAddress emitted')
//     }
// }));
