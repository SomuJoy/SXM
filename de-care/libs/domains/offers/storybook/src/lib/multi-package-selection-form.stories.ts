// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
//
// import { OffersModule, MultiPackageSelectionFormComponent } from '@de-care/offers';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { withA11y } from '@storybook/addon-a11y';
// import { boolean, withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { SettingsService } from '@de-care/settings';
// import { mockPackageDescriptionsProvider } from './offers.stories';
//
// const samplePackage = {
//     name: 'Sirius All Access',
//     planCode: 'Promo - All Access - 6mo (49.99) - 1X',
//     packageName: 'SXM_SIR_AUD_ALLACCESS',
//     promoCode: null,
//     termLength: 6,
//     price: 49.99,
//     pricePerMonth: 21.99,
//     retailPrice: 20.99,
//     packageDescription: {
//         name: 'Sirius All Access',
//         packageName: 'SXM_SIR_AUD_ALLACCESS',
//         description: '',
//         promoFooter: 'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//         channels: [
//             {
//                 title: '<b>Sirius All Access Includes:</b>',
//                 descriptions: [
//                     '140+ Channels',
//                     '85 ad-free music channels',
//                     'Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//                     'Listen in your car from coast to coast'
//                 ]
//             }
//         ]
//     }
// };
//
// const stories = storiesOf('offers/multi-package-selection-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule, SxmUiModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: MultiPackageSelectionFormComponent,
//     template: `
//             <multi-package-selection-form
//                 [data]="data"
//                 [usePromotionalTextCopy]="usePromotionalTextCopy"
//             ></multi-package-selection-form>
//         `,
//     props: {
//         data: {
//             eligiblePackages: [samplePackage, { ...samplePackage, planCode: 'Promo - Sirius Select - 6mo (49.99) - 1X' }]
//         },
//         usePromotionalTextCopy: boolean('@Input usePromotionalTextCopy', false)
//     }
// }));
//
// stories.add('only one package', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule, SxmUiModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: MultiPackageSelectionFormComponent,
//     template: `
//             <multi-package-selection-form
//                 [data]="data"
//                 [usePromotionalTextCopy]="usePromotionalTextCopy"
//             ></multi-package-selection-form>
//         `,
//     props: {
//         data: {
//             eligiblePackages: [samplePackage],
//             additionalEligiblePackages: []
//         },
//         usePromotionalTextCopy: boolean('@Input usePromotionalTextCopy', false)
//     }
// }));
