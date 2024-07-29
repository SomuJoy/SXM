// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DomainsOffersUiOfferFormsModule } from '../domains-offers-ui-offer-forms.module';
// import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { FormControl, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
//
// const stories = storiesOf('Domains/Offers/OfferCardFormFieldOptionComponent', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, DomainsOffersUiOfferFormsModule],
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
// const formControl = new FormControl(null, Validators.required);
// const props = { formGroup: new FormGroup({ planCode: formControl }), formControl, formControlName: 'planCode' };
//
// stories.add('default', () => ({
//     template: `
//         <form [formGroup]="formGroup">
//             <offer-card-form-field-option
//                 formControlName="planCode"
//                 [formControl]="formControl"
//                 [offerOptionData]="offerOptionData"
//             >
//             </offer-card-form-field-option>
//         </form>
//     `,
//     props: {
//         ...props,
//         offerOptionData: {
//             fieldLabel: 'Add this plan',
//             planCodeOptions: [{ planCode: 'plan A' }],
//             packageData
//         }
//     }
// }));
//
// stories.add('with headline flag', () => ({
//     template: `
//         <form [formGroup]="formGroup">
//             <offer-card-form-field-option
//                 formControlName="planCode"
//                 [formControl]="formControl"
//                 [offerOptionData]="offerOptionData"
//             >
//             </offer-card-form-field-option>
//         </form>
//     `,
//     props: {
//         ...props,
//         offerOptionData: {
//             headlineFlagCopy: 'Our best plan',
//             fieldLabel: 'Add this plan',
//             planCodeOptions: [{ planCode: 'plan A' }],
//             packageData
//         }
//     }
// }));
//
// stories.add('with options', () => ({
//     template: `
//         <form [formGroup]="formGroup">
//             <offer-card-form-field-option
//                 formControlName="planCode"
//                 [formControl]="formControl"
//                 [offerOptionData]="offerOptionData"
//             >
//             </offer-card-form-field-option>
//         </form>
//     `,
//     props: {
//         ...props,
//         offerOptionData: {
//             fieldLabel: 'Add this plan',
//             optionsHeaderCopy: `Enjoy 51 channels of music & talk. Plus, you'll get 3 more channels from the genre of your choice:`,
//             planCodeOptions: [
//                 { planCode: 'plan option A', optionLabel: 'Pop', optionLabelTooltipText: `<strong>Pop channels:</strong><ul><li>Pop Rewind</li><li>Pop Vinyl</li></ul>` },
//                 {
//                     planCode: 'plan option B',
//                     optionLabel: 'Rock',
//                     optionLabelTooltipText: `<strong>Rock channels:</strong><ul><li>Classic Rewind</li><li>Classic Vinyl</li><li>Lithium</li></ul>`
//                 },
//                 {
//                     planCode: 'plan option C',
//                     optionLabel: 'Hip Hop',
//                     optionLabelTooltipText: `<strong>Hip Hop channels:</strong><ul><li>Hip Hop Rewind</li><li>Hip Hop Vinyl</li></ul>`
//                 }
//             ],
//             packageData: {
//                 ...packageData,
//                 platformPlan: 'Sirius Choice',
//                 priceAndTermDescTitle: '<span data-price>$7.99</span>/mo',
//                 processingFeeDisclaimer: 'See <strong>Offer Details</strong> below.'
//             }
//         }
//     }
// }));
