// TODO: STORYBOOK_AUDIT

// import { OEM_COMMON_STORYBOOK_STORIES } from '../../oem-common.stories';
// import { object } from '@storybook/addon-knobs';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { action } from '@storybook/addon-actions';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// OEM_COMMON_STORYBOOK_STORIES.add('summary-step', () => ({
//     template: `
//     <div class="oem-theme background-gray-light">
//         <summary-step [offer]="offer" [quote]="quote" (completed)="completed()"></summary-step>
//     </div>
//     `,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: { allPackageDescriptions: () => of([{ name: 'SiriusXM Select', packageName: '1_SIR_AUD_EVT' }]) }
//             },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } }
//         ]
//     },
//     props: {
//         offer: object('@Input() offer', {}),
//         quote: object('@Input() quote', MOCK_QUOTE_MODEL),
//         completed: action('@Output() completed emitted', {})
//     }
// }));
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
