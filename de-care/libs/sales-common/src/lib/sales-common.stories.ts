// TODO: STORYBOOK_AUDIT

// import { withKnobs, number, object, text } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { TRANSLATE_PROVIDERS, withTranslation, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { OfferDetailsComponent } from './offer-details/offer-details.component';
// import { SalesCommonModule } from './sales-common.module';
// import { PurchaseStepEnum, VehicleModel, DataOfferService } from '@de-care/data-services';
// import { PersonalInfoComponent } from './personal-info/personal-info.component';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { of } from 'rxjs';
//
// export const SALES_COMMON_STORYBOOK_STORIES = storiesOf('sales-common', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [BrowserAnimationsModule, SalesCommonModule],
//             providers: [...TRANSLATE_PROVIDERS, { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } }]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// SALES_COMMON_STORYBOOK_STORIES.add('offer-details', () => ({
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             { provide: UserSettingsService, useValue: { isQuebec$: of(false) } }
//         ]
//     },
//     component: OfferDetailsComponent,
//     props: {
//         step: number('step', 1),
//         purchaseSteps: [{ id: PurchaseStepEnum.Review }],
//         details: object('details', {
//             type: 'TRIAL_EXT',
//             name: 'All Access',
//             processingFee: 2,
//             offerTotal: 29.99,
//             offerTerm: 6,
//             savingsPercent: 50,
//             retailRate: 60.0,
//             etf: 5.99,
//             etfTerm: 12
//         })
//     }
// }));
//
// SALES_COMMON_STORYBOOK_STORIES.add('offer-details: is Quebec', () => ({
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             { provide: UserSettingsService, useValue: { isQuebec$: of(true) } }
//         ]
//     },
//     component: OfferDetailsComponent,
//     props: {
//         step: number('step', 1),
//         purchaseSteps: [{ id: PurchaseStepEnum.Review }],
//         details: object('details', {
//             type: 'DEFAULT',
//             offerTotal: 29.99,
//             offerTerm: 6,
//             savingsPercent: 50,
//             retailRate: 60.0,
//             etf: 5.99,
//             etfTerm: 12
//         })
//     }
// }));
//
// SALES_COMMON_STORYBOOK_STORIES.add('personal-info', () => ({
//     component: PersonalInfoComponent,
//     props: {
//         vehicleInfo: object('vehicleInfo', {
//             year: '2019',
//             make: 'Dodge',
//             model: 'Charger'
//         } as VehicleModel),
//         radioId: text('radioId', `12345678`)
//     }
// }));
