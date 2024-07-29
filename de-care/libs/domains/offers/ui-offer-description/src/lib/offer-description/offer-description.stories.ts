// TODO: STORYBOOK_AUDIT

// import { UserSettingsService, SettingsService } from '@de-care/settings';
// import { of } from 'rxjs';
// import { MOCK_ALL_PACKAGE_DESC, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { OfferDescriptionComponent } from './offer-description.component';
// import { object, withKnobs, boolean } from '@storybook/addon-knobs';
// import { OfferInfo } from './offer-description-base.component';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { DomainsOffersUiOfferDescriptionModule } from '../domains-offers-ui-offer-description.module';
// import { DataOfferService } from '@de-care/data-services';
//
// const stories = storiesOf('Domains/Offers/OfferDescription', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiOfferDescriptionModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 { provide: SettingsService, useValue: { isCanadaMode: false } },
//                 { provide: DataOfferService, useValue: { ...MOCK_ALL_PACKAGE_DESC, customer: () => of({}) } }
//             ]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: OfferDescriptionComponent,
//     props: {
//         offerInfo: object('offerInfo', {
//             processingFee: 0,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             termLength: 6,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             price: 15.99
//         } as OfferInfo),
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false)
//     }
// }));
//
// stories.add('price and term hidden', () => ({
//     component: OfferDescriptionComponent,
//     props: {
//         offerInfo: object('offerInfo', {
//             processingFee: 0,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             termLength: 6,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             price: 15.99
//         } as OfferInfo),
//         excludePriceAndTermDisplay: true
//     }
// }));
//
// stories.add('is quebec', () => ({
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             { provide: UserSettingsService, useValue: { isQuebec$: of(true) } }
//         ]
//     },
//     component: OfferDescriptionComponent,
//     props: {
//         offerInfo: object('offerInfo', {
//             processingFee: 0,
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             termLength: 6,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             price: 15.99
//         } as OfferInfo),
//         excludePriceAndTermDisplay: false
//     }
// }));
