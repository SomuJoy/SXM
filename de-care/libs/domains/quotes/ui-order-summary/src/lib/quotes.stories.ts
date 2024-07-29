// TODO: STORYBOOK_AUDIT

// import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DataOfferService } from '@de-care/data-services';
// import { AppSettings } from '@de-care/settings';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { TRANSLATE_PROVIDERS, TRANSLATE_PROVIDERS_CA, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DomainsQuotesUiOrderSummaryModule } from './domains-quotes-ui-order-summary.module';
//
// export const QUOTES_STORYBOOK_STORIES = storiesOf('quotes', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [BrowserAnimationsModule, DomainsQuotesUiOrderSummaryModule],
//             providers: [
//                 CurrencyPipe,
//                 I18nPluralPipe,
//                 ...TRANSLATE_PROVIDERS,
//                 { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } },
//                 { provide: AppSettings, useValue: { country: 'us' } }
//             ]
//         })
//     )
//     .addDecorator(withTranslation);
//
// export const QUOTES_STORYBOOK_STORIES_CA = storiesOf('quotes-ca', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [BrowserAnimationsModule, DomainsQuotesUiOrderSummaryModule],
//             providers: [
//                 CurrencyPipe,
//                 I18nPluralPipe,
//                 ...TRANSLATE_PROVIDERS_CA,
//                 { provide: DataOfferService, useValue: { allPackageDescriptions: () => of([]) } },
//                 { provide: AppSettings, useValue: { country: 'ca' } }
//             ]
//         })
//     )
//     .addDecorator(withTranslation);
//
// export const MOCK_CHANGE_PLAN_QUOTE_MODEL = {
//     futureQuote: null,
//     currentQuote: {
//         totalTaxAmount: '2.41',
//         totalFeesAmount: '6.41',
//         totalTaxesAndFeesAmount: '8.82',
//         consolidatedCreditAmount: '10.02',
//         totalAmount: '38.76',
//         discountAmount: '0.00',
//         pricePerMonth: '4.99',
//         currentBalance: '',
//         previousBalance: '',
//         fees: [{ description: 'U.S. Music Royalty Fee', amount: '6.41' }],
//         taxes: [{ description: 'State Tax', amount: '2.41' }],
//         details: [
//             {
//                 planCode: 'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X',
//                 packageName: '1_SIR_AUD_EVT',
//                 termLength: 6,
//                 priceAmount: '29.94',
//                 taxAmount: '2.41',
//                 feeAmount: '6.41',
//                 totalTaxesAndFeesAmount: '8.82',
//                 taxes: [{ description: 'State Tax', amount: '2.41' }],
//                 fees: [{ description: 'U.S. Music Royalty Fee', amount: '6.41' }],
//                 startDate: '2019-09-06',
//                 endDate: '2020-03-06',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     },
//     proRatedRenewalQuote: null,
//     promoRenewalQuote: null,
//     renewalQuote: {
//         totalTaxAmount: '1.29',
//         totalFeesAmount: '3.42',
//         totalTaxesAndFeesAmount: '4.71',
//         totalAmount: '20.70',
//         discountAmount: '0.00',
//         pricePerMonth: '15.99',
//         currentBalance: '',
//         previousBalance: '',
//         fees: [{ description: 'U.S. Music Royalty Fee', amount: '3.42' }],
//         taxes: [{ description: 'State Tax', amount: '1.29' }],
//         details: [
//             {
//                 planCode: 'Select - 1mo - wActv',
//                 packageName: '1_SIR_AUD_EVT',
//                 termLength: 1,
//                 priceAmount: '15.99',
//                 taxAmount: '1.29',
//                 feeAmount: '3.42',
//                 totalTaxesAndFeesAmount: '4.71',
//                 taxes: [{ description: 'State Tax', amount: '1.29' }],
//                 fees: [{ description: 'U.S. Music Royalty Fee', amount: '3.42' }],
//                 startDate: '2020-03-06',
//                 endDate: '2020-04-06',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     }
// };
//
// export const MOCK_QUOTE_MODEL = {
//     currentQuote: null,
//     futureQuote: {
//         totalTaxAmount: '2.41',
//         totalFeesAmount: '6.41',
//         totalTaxesAndFeesAmount: '8.82',
//         totalAmount: '38.76',
//         discountAmount: '0.00',
//         pricePerMonth: '4.99',
//         currentBalance: '',
//         previousBalance: '',
//         fees: [{ description: 'U.S. Music Royalty Fee', amount: '6.41' }],
//         taxes: [{ description: 'State Tax', amount: '2.41' }],
//         details: [
//             {
//                 planCode: 'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X',
//                 packageName: '1_SIR_AUD_EVT',
//                 termLength: 6,
//                 priceAmount: '29.94',
//                 taxAmount: '2.41',
//                 feeAmount: '6.41',
//                 totalTaxesAndFeesAmount: '8.82',
//                 taxes: [{ description: 'State Tax', amount: '2.41' }],
//                 fees: [{ description: 'U.S. Music Royalty Fee', amount: '6.41' }],
//                 startDate: '2019-09-06',
//                 endDate: '2020-03-06',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     },
//     proRatedRenewalQuote: null,
//     promoRenewalQuote: null,
//     renewalQuote: {
//         totalTaxAmount: '1.29',
//         totalFeesAmount: '3.42',
//         totalTaxesAndFeesAmount: '4.71',
//         totalAmount: '20.70',
//         discountAmount: '0.00',
//         consolidatedCreditAmount: '10.02',
//         pricePerMonth: '15.99',
//         currentBalance: '',
//         previousBalance: '',
//         fees: [{ description: 'U.S. Music Royalty Fee', amount: '3.42' }],
//         taxes: [{ description: 'State Tax', amount: '1.29' }],
//         details: [
//             {
//                 planCode: 'Select - 1mo - wActv',
//                 packageName: '1_SIR_AUD_EVT',
//                 termLength: 1,
//                 priceAmount: '15.99',
//                 taxAmount: '1.29',
//                 feeAmount: '3.42',
//                 totalTaxesAndFeesAmount: '4.71',
//                 taxes: [{ description: 'State Tax', amount: '1.29' }],
//                 fees: [{ description: 'U.S. Music Royalty Fee', amount: '3.42' }],
//                 startDate: '2020-03-06',
//                 endDate: '2020-04-06',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     }
// };
// export const MOCK_OFFERS_DATA = {
//     'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X': {
//         isMCP: true,
//         termLength: 6
//     },
//     'Select - 1mo - wActv': {
//         isMCP: true,
//         termLength: 1
//     }
// };
