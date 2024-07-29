// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { YourDeviceInfoComponent } from './your-device-info.component';
// import { DataOfferService, PlanTypeEnum } from '@de-care/data-services';
// import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { CustomerInfoModule } from '../customer-info.module';
// import { of } from 'rxjs';
//
// const stories = storiesOf('customer-info/your-device-info', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [CustomerInfoModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings);
//
// const mockPackageDescriptions = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'fr_CA') {
//                 return of([{ name: 'FR:: Sirius Select', packageName: 'SIR_AUD_EVT' }]);
//             } else {
//                 return of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }]);
//             }
//         }
//     }
// };
//
// stories.add('subscription and one plan', () => ({
//     component: YourDeviceInfoComponent,
//     moduleMetadata: {
//         providers: [mockPackageDescriptions]
//     },
//     props: {
//         data: {
//             vehicleInfo: {
//                 year: '2019',
//                 make: 'Ford',
//                 model: 'Explorer'
//             },
//             plans: [
//                 {
//                     packageName: 'SIR_AUD_EVT',
//                     type: PlanTypeEnum.TrialGgle,
//                     endDate: 1543053600000
//                 }
//             ]
//         }
//     }
// }));
// stories.add('closed device', () => ({
//     component: YourDeviceInfoComponent,
//     props: {
//         data: {
//             vehicleInfo: {
//                 year: '2019',
//                 make: 'Ford',
//                 model: 'Explorer'
//             },
//             plans: null,
//             closedDate: '1543053600000'
//         }
//     }
// }));
