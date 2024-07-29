// TODO: STORYBOOK_AUDIT

// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { SettingsService } from '@de-care/settings';
// import { action } from '@storybook/addon-actions';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DomainsOffersUiOfferCardFormFieldModule } from '../domains-offers-ui-offer-card-form-field.module';
// import { boolean, withKnobs } from '@storybook/addon-knobs';
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
//         footer: 'This is everything we’ve got: our widest variety of entertainment, now with the power to customize it to you.',
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
// const stories = storiesOf('Domains/Offers/OfferCardFormField', module)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiOfferCardFormFieldModule]
//         })
//     )
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: false } }]
//     },
//     template: `
//             <form [formGroup]="offerForm" (ngSubmit)="submitOfferForm(offerForm.value)">
//                 <offer-card-form-field
//                     formControlName="option"
//                     [planCode]="planCode"
//                     [flagPresent]="flagPresent"
//                     [headlinePresent]="headlinePresent"
//                     [isCurrentPackage]="isCurrentPackage"
//                     [offerInfo]="offerInfo"
//                     [packageDescription]="packageDescription"
//                     (packageClicked)="packageClicked()"
//                 >
//                 </offer-card-form-field>
//                 <button class="submit" type="submit">
//                     SUBMIT
//                 </button>
//             </form>
//         `,
//     props: {
//         offerForm: new FormGroup({ option: new FormControl() }),
//         planCode: 'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X',
//         flagPresent: boolean('flag present', true),
//         headlinePresent: boolean('headline present', true),
//         isCurrentPackage: boolean('is current package', false),
//         offerInfo: samplePackage,
//         packageDescription: samplePackage.packageDescription,
//         submitOfferForm: action('submitOfferForm'),
//         packageClicked: action('packageClicked')
//     }
// }));
