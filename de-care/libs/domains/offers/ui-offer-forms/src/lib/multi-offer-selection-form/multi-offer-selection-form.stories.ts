// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { DomainsOffersUiOfferFormsModule } from '../domains-offers-ui-offer-forms.module';
// import { action } from '@storybook/addon-actions';
//
// const stories = storiesOf('Domains/Offers/MultiOfferSelectionFormComponent', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [BrowserAnimationsModule, DomainsOffersUiOfferFormsModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER]
//         })
//     );
//
// const packageData = {
//     packageName: 'XM Select',
//     priceAndTermDescTitle: '<span data-duration>12 months</span> for <span data-price>$5</span>/mo',
//     processingFeeDisclaimer: 'Plus $2 processing fee. Then $16.99.<br/>See <strong>Offer Details</strong> below.',
//     highlightsText: [
//         '325+ channels in your car, on your phone, at home, and online',
//         'Ad-free music and Xtra channels to stream for every mood and activity',
//         'News, entertainment, comedy, and sports'
//     ],
//     icons: {
//         inside: { isActive: true, label: 'Inside the Car' },
//         outside: { isActive: true, label: 'Outside the Car' },
//         pandora: { isActive: false, label: 'Custom Stations' }
//     },
//     footer: 'Listen & watch your favorites in all your favorite places—in your car, on your phone, or at home.'
// };
//
// const template = `
//     <multi-offer-selection-form [offerOptions]="offerOptions" (submitted)="onSubmit($event)">
//         <p validationErrorCopy>Pick a plan below.</p>
//     </multi-offer-selection-form>
// `;
//
// const props = {
//     onSubmit: action('@Output() submitted')
// };
//
// stories.add('with 1 main offer', () => ({
//     template,
//     props: {
//         ...props,
//         offerOptions: {
//             mainOffers: [
//                 {
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan A' }],
//                     packageData
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('with 1 main offer with headline flag', () => ({
//     template,
//     props: {
//         ...props,
//         offerOptions: {
//             mainOffers: [
//                 {
//                     headlineFlagCopy: 'Our best plan',
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan A' }],
//                     packageData
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('with 1 main offer with custom submit button copy', () => ({
//     template: `
//         <multi-offer-selection-form
//             [offerOptions]="offerOptions"
//             submitButtonLabel="Custom Continue Text"
//             (submitted)="onSubmit($event)"
//         >
//             <p validationErrorCopy>Pick a plan below.</p>
//         </multi-offer-selection-form>
//     `,
//     props: {
//         ...props,
//         offerOptions: {
//             mainOffers: [
//                 {
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan A' }],
//                     packageData
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('with 1 main offer that has options', () => ({
//     template,
//     props: {
//         ...props,
//         offerOptions: {
//             mainOffers: [
//                 {
//                     fieldLabel: 'Add this plan',
//                     optionsHeaderCopy: `Enjoy 51 channels of music & talk. Plus, you'll get 3 more channels from the genre of your choice:`,
//                     planCodeOptions: [
//                         {
//                             planCode: 'plan option A',
//                             optionLabel: 'Pop',
//                             optionLabelTooltipText: `<strong>Pop channels:</strong><ul><li>Pop Rewind</li><li>Pop Vinyl</li></ul>`
//                         },
//                         {
//                             planCode: 'plan option B',
//                             optionLabel: 'Rock',
//                             optionLabelTooltipText: `<strong>Rock channels:</strong><ul><li>Classic Rewind</li><li>Classic Vinyl</li><li>Lithium</li></ul>`
//                         },
//                         {
//                             planCode: 'plan option C',
//                             optionLabel: 'Hip Hop',
//                             optionLabelTooltipText: `<strong>Hip Hop channels:</strong><ul><li>Hip Hop Rewind</li><li>Hip Hop Vinyl</li></ul>`
//                         }
//                     ],
//                     packageData: {
//                         ...packageData,
//                         platformPlan: 'Sirius Choice',
//                         priceAndTermDescTitle: '<span data-price>$7.99</span>/mo',
//                         processingFeeDisclaimer: 'See <strong>Offer Details</strong> below.'
//                     }
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('with 2 main offers', () => ({
//     template,
//     props: {
//         ...props,
//         offerOptions: {
//             mainOffers: [
//                 {
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan A' }],
//                     packageData
//                 },
//                 {
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan B' }],
//                     packageData
//                 }
//             ]
//         }
//     }
// }));
//
// stories.add('with 1 main offer and 1 additional offer', () => ({
//     template,
//     props: {
//         ...props,
//         offerOptions: {
//             mainOffers: [
//                 {
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan A' }],
//                     packageData
//                 }
//             ],
//             additionalOffers: [
//                 {
//                     fieldLabel: 'Add this plan',
//                     planCodeOptions: [{ planCode: 'plan B' }],
//                     packageData
//                 }
//             ]
//         }
//     }
// }));
