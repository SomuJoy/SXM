// TODO: STORYBOOK_AUDIT

// export const MOCK_MCP_QUOTE_MODEL = {
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
//                 priceAmount: '5.70',
//                 taxAmount: '0.86',
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
// export const MOCK_OFFERS_DATA = {
//     'Promo - Select - 6mo - 29.94 - (4.99FOR6) - 1X': {
//         isMCP: false,
//         termLength: 6
//     },
//     'Select - 1mo - wActv': {
//         isMCP: false,
//         termLength: 1
//     }
// };
//
// export const SELECT_1_MONTH_OFFER = {
//     'Select - 1mo': {
//         isMCP: true,
//         termLength: 1,
//         msrpPrice: 16.99,
//         mrdEligible: false,
//         deal: null,
//         fallback: true,
//         marketType: null,
//         packageName: 'SXM_SIR_CAN_EVT',
//         planCode: 'Select - 1mo',
//         price: 16.99,
//         priceChangeMessagingType: 'MRF',
//         pricePerMonth: 16.99,
//         processingFee: null,
//         promoCode: '',
//         retailPrice: 16.99,
//         supportedServices: [],
//         type: 'SELF_PAY'
//     }
// };
//
// export const MOSTLY_MUSIC_1_MONTH_OFFER = {
//     'Select - 1mo': {
//         isMCP: true,
//         termLength: 1,
//         msrpPrice: 10.99,
//         mrdEligible: false,
//         deal: null,
//         fallback: false,
//         marketType: null,
//         packageName: 'SXM_SIR_CAN_MM',
//         planCode: 'Mostly Music - 1mo - wActv|Promo $7.66 Off for 6mos',
//         price: 3.33,
//         priceChangeMessagingType: 'MRF',
//         pricePerMonth: 3.33,
//         processingFee: null,
//         promoCode: '0283',
//         retailPrice: 10.99,
//         supportedServices: [],
//         type: 'PROMO_MCP'
//     }
// };
//
// export const MOCK_MCP_RECURRING_QUOTE_MODEL = {
//     currentQuote: null,
//     futureQuote: null,
//     proRatedRenewalQuote: null,
//     promoRenewalQuote: {
//         totalTaxAmount: '0.57',
//         totalFeesAmount: '0.00',
//         totalTaxesAndFeesAmount: '0.57',
//         totalAmount: '4.37',
//         discountAmount: '-7.66',
//         pricePerMonth: '3.80',
//         currentBalance: '',
//         previousBalance: '',
//         fees: [],
//         taxes: [
//             {
//                 description: 'Goods_and_Services_Tax_GST',
//                 amount: '0.19'
//             },
//             {
//                 description: 'Quebec_Sales_Tax_QST',
//                 amount: '0.38'
//             }
//         ],
//         details: [
//             {
//                 planCode: 'Mostly Music - 1mo - wActv|Promo $7.66 Off for 6mos',
//                 packageName: 'SIR_CAN_MM',
//                 termLength: 1,
//                 priceAmount: '3.80',
//                 taxAmount: '0.57',
//                 feeAmount: '0.00',
//                 totalTaxesAndFeesAmount: '0.57',
//                 taxes: [
//                     {
//                         description: 'Goods_and_Services_Tax_GST',
//                         amount: '0.19'
//                     },
//                     {
//                         description: 'Quebec_Sales_Tax_QST',
//                         amount: '0.38'
//                     }
//                 ],
//                 fees: [],
//                 startDate: '2020-11-15',
//                 endDate: '2020-12-15',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     },
//     renewalQuote: {
//         totalTaxAmount: '1.88',
//         totalFeesAmount: '0.00',
//         totalTaxesAndFeesAmount: '1.88',
//         totalAmount: '14.43',
//         discountAmount: '0.00',
//         pricePerMonth: '12.55',
//         currentBalance: '',
//         reviousBalance: '',
//         fees: [],
//         taxes: [
//             {
//                 description: 'Goods_and_Services_Tax_GST',
//                 amount: '0.63'
//             },
//             {
//                 description: 'Quebec_Sales_Tax_QST',
//                 amount: '1.25'
//             }
//         ],
//         details: [
//             {
//                 planCode: 'Mostly Music - 1mo',
//                 packageName: 'SIR_CAN_MM',
//                 termLength: 1,
//                 priceAmount: '12.55',
//                 taxAmount: '1.88',
//                 feeAmount: '0.00',
//                 totalTaxesAndFeesAmount: '1.88',
//                 taxes: [
//                     {
//                         description: 'Goods_and_Services_Tax_GST',
//                         amount: '0.63'
//                     },
//                     {
//                         description: 'Quebec_Sales_Tax_QST',
//                         amount: '1.25'
//                     }
//                 ],
//                 fees: [],
//                 startDate: '2021-05-15',
//                 endDate: '2021-06-15',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     }
// };
//
// export const PROMOTION_QUOTE_DUE_ON_FUTURE_DATE = {
//     currentQuote: null,
//     futureQuote: {
//         currentBalance: null,
//         details: [
//             {
//                 planCode: 'Promo - Select - 12mo - 60.00 - 1moFO',
//                 packageName: 'SIR_CAN_EVT',
//                 termLength: 12,
//                 totalTaxesAndFeesAmount: '17.43',
//                 isMrdEligible: false,
//                 priceAmount: '60.00',
//                 startDate: '2020-11-18',
//                 taxAmount: '8.91',
//                 fees: [
//                     {
//                         amount: '8.52',
//                         description: 'Canadian_Music_Royalty_Fee'
//                     }
//                 ],
//                 taxes: [
//                     {
//                         description: 'Harmonized_Sales_Tax_HST',
//                         amount: '17.43'
//                     }
//                 ]
//             }
//         ]
//     },
//     proRatedRenewalQuote: null,
//     promoRenewalQuote: {
//         totalTaxAmount: '0.57',
//         totalFeesAmount: '0.00',
//         totalTaxesAndFeesAmount: '0.57',
//         totalAmount: '4.37',
//         discountAmount: '-7.66',
//         pricePerMonth: '3.80',
//         currentBalance: '',
//         previousBalance: '',
//         fees: [],
//         taxes: [
//             {
//                 description: 'Goods_and_Services_Tax_GST',
//                 amount: '0.19'
//             },
//             {
//                 description: 'Quebec_Sales_Tax_QST',
//                 amount: '0.38'
//             }
//         ],
//         details: [
//             {
//                 planCode: 'Mostly Music - 1mo - wActv|Promo $7.66 Off for 6mos',
//                 packageName: 'SIR_CAN_MM',
//                 termLength: 1,
//                 priceAmount: '3.80',
//                 taxAmount: '0.57',
//                 feeAmount: '0.00',
//                 totalTaxesAndFeesAmount: '0.57',
//                 taxes: [
//                     {
//                         description: 'Goods_and_Services_Tax_GST',
//                         amount: '0.19'
//                     },
//                     {
//                         description: 'Quebec_Sales_Tax_QST',
//                         amount: '0.38'
//                     }
//                 ],
//                 fees: [],
//                 startDate: '2020-11-15',
//                 endDate: '2020-12-15',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     },
//     renewalQuote: {
//         totalTaxAmount: '21.92',
//         totalFeesAmount: '2.41',
//         totalTaxesAndFeesAmount: '2.52',
//         totalAmount: '21.92',
//         discountAmount: '0.00',
//         pricePerMonth: '16.99',
//         currentBalance: '',
//         reviousBalance: '',
//         fees: [
//             {
//                 amount: '2.41',
//                 description: 'Canadian_Music_Royalty_Fee'
//             }
//         ],
//         taxes: [
//             {
//                 description: 'Harmonized_Sales_Tax_HST',
//                 amount: '2.52'
//             }
//         ],
//         details: [
//             {
//                 planCode: 'Mostly Music - 1mo',
//                 packageName: 'SIR_CAN_MM',
//                 termLength: 1,
//                 priceAmount: '12.55',
//                 taxAmount: '1.88',
//                 feeAmount: '2.41',
//                 totalTaxesAndFeesAmount: '4.93',
//                 taxes: [
//                     {
//                         description: 'Goods_and_Services_Tax_GST',
//                         amount: '0.63'
//                     },
//                     {
//                         description: 'Quebec_Sales_Tax_QST',
//                         amount: '1.25'
//                     }
//                 ],
//                 fees: [],
//                 startDate: '2021-11-18',
//                 endDate: '2021-12-18',
//                 isMrdEligible: false,
//                 balanceType: null
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     }
// };
//
// export const IN_TRIAL_MOCK = {
//     currentQuote: null,
//     futureQuote: {
//         totalTaxAmount: '0.00',
//         totalFeesAmount: '2.00',
//         totalTaxesAndFeesAmount: '2.00',
//         totalAmount: '2.00',
//         discountAmount: '0.00',
//         pricePerMonth: '0.00',
//         currentBalance: '',
//         consolidatedCreditAmount: '',
//         previousBalance: '',
//         fees: [{ description: 'Processing Fee', amount: '2.00' }],
//         taxes: [],
//         details: [
//             {
//                 planCode: 'Promo - All Access - 3mo - $2.00 - (RTC)',
//                 packageName: '1_SIR_AUD_ALLACCESS',
//                 termLength: 3,
//                 priceAmount: '0.00',
//                 taxAmount: '0.00',
//                 feeAmount: '2.00',
//                 totalTaxesAndFeesAmount: '2.00',
//                 taxes: [],
//                 fees: [{ description: 'Processing Fee', amount: '2.00' }],
//                 startDate: '2021-08-01',
//                 endDate: '2021-11-01',
//                 isMrdEligible: false,
//                 balanceType: null,
//                 type: 'TRIAL_EXT_RTC',
//                 dealType: ''
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     },
//     proRatedRenewalQuote: null,
//     promoRenewalQuote: null,
//     renewalQuote: {
//         totalTaxAmount: '0.00',
//         totalFeesAmount: '4.71',
//         totalTaxesAndFeesAmount: '4.71',
//         totalAmount: '26.70',
//         discountAmount: '0.00',
//         pricePerMonth: '21.99',
//         currentBalance: '',
//         consolidatedCreditAmount: '',
//         previousBalance: '',
//         fees: [{ description: 'U.S. Music Royalty Fee', amount: '4.71' }],
//         taxes: [],
//         details: [
//             {
//                 planCode: 'All Access - 1mo - wActv',
//                 packageName: '1_SIR_AUD_ALLACCESS',
//                 termLength: 1,
//                 priceAmount: '21.99',
//                 taxAmount: '0.00',
//                 feeAmount: '4.71',
//                 totalTaxesAndFeesAmount: '4.71',
//                 taxes: [],
//                 fees: [{ description: 'U.S. Music Royalty Fee', amount: '4.71' }],
//                 startDate: '2021-11-01',
//                 endDate: '2021-12-01',
//                 isMrdEligible: false,
//                 balanceType: null,
//                 type: 'SELF_PAY',
//                 dealType: ''
//             }
//         ],
//         isUpgraded: null,
//         isProrated: false
//     }
// };
