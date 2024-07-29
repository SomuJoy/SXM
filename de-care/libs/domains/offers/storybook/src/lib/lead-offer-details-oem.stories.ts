// TODO: STORYBOOK_AUDIT

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SettingsService } from '@de-care/settings';
// import { SharedEventTrackService } from '@de-care/data-layer';
//
// import { mockPackageDescriptionsProvider } from './offers.stories';
// import { LeadOfferDetailsOemComponent, OffersModule } from '@de-care/offers';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
//
// const stories = storiesOf('offers/lead-offer-details-oem', module)
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
//         imports: [BrowserAnimationsModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     component: LeadOfferDetailsOemComponent,
//     props: {
//         offer: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             pricePerMonth: 4.99,
//             price: 29.99,
//             retailPrice: 30.0,
//             termLength: 6
//         },
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false)
//     }
// }));
//
// stories.add('with theme', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule],
//         providers: [
//             { provide: SharedEventTrackService, useValue: { track: () => {} } },
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             mockPackageDescriptionsProvider
//         ]
//     },
//     template: `
//     <div class="oem-theme">
//         <lead-offer-details-oem [offer]="offer"></lead-offer-details-oem>
//     </div>`,
//     props: {
//         offer: {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             type: 'PROMO',
//             pricePerMonth: 4.99,
//             price: 29.99,
//             retailPrice: 30.0,
//             termLength: 6
//         }
//     }
// }));
