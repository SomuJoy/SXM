// TODO: STORYBOOK_AUDIT

// import { QUOTES_STORYBOOK_STORIES, MOCK_QUOTE_MODEL, MOCK_OFFERS_DATA, MOCK_CHANGE_PLAN_QUOTE_MODEL } from '../../quotes.stories';
// import { MOCK_MCP_RECURRING_QUOTE_MODEL, PROMOTION_QUOTE_DUE_ON_FUTURE_DATE, MOSTLY_MUSIC_1_MONTH_OFFER, IN_TRIAL_MOCK } from '../mock-quotes.stories';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { boolean, object, text } from '@storybook/addon-knobs';
// import { OrderSummaryComponent } from '../../order-summary/order-summary.component';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// QUOTES_STORYBOOK_STORIES.add('order-summary', () => ({
//     component: OrderSummaryComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: () =>
//                         of([
//                             { name: 'SiriusXM Select', packageName: '1_SIR_AUD_EVT' },
//                             { name: 'AMZ Package', packageName: 'AMZ_DOT' }
//                         ])
//                 }
//             },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } }
//         ]
//     },
//     props: {
//         giftCardUsed: boolean('giftCardUsed', false),
//         isClosedRadio: boolean('isClosedRadio', false),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOCK_OFFERS_DATA),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', MOCK_QUOTE_MODEL)
//     }
// }));
//
// QUOTES_STORYBOOK_STORIES.add('order-summary-change-plan', () => ({
//     component: OrderSummaryComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: () =>
//                         of([
//                             { name: 'SiriusXM Select', packageName: '1_SIR_AUD_EVT' },
//                             { name: 'AMZ Package', packageName: 'AMZ_DOT' }
//                         ])
//                 }
//             },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } }
//         ]
//     },
//     props: {
//         giftCardUsed: boolean('giftCardUsed', false),
//         showUnusedCreditLine: boolean('showUnusedCreditLine', true),
//         isClosedRadio: boolean('isClosedRadio', false),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOCK_OFFERS_DATA),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', MOCK_CHANGE_PLAN_QUOTE_MODEL)
//     }
// }));
//
// QUOTES_STORYBOOK_STORIES.add('Full Price renewal', () => ({
//     component: OrderSummaryComponent,
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
//         giftCardUsed: boolean('giftCardUsed', false),
//         isClosedRadio: boolean('isClosedRadio', false),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOCK_OFFERS_DATA),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', MOCK_QUOTE_MODEL)
//     }
// }));
//
// QUOTES_STORYBOOK_STORIES.add('Trial upgrade', () => ({
//     component: OrderSummaryComponent,
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
//         giftCardUsed: boolean('giftCardUsed', false),
//         isClosedRadio: boolean('isClosedRadio', false),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOCK_OFFERS_DATA),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', MOCK_QUOTE_MODEL)
//     }
// }));
//
// QUOTES_STORYBOOK_STORIES.add('MCP Quotes: Recurring', () => ({
//     component: OrderSummaryComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: { allPackageDescriptions: () => of([{ name: 'Mostly Music Select', packageName: 'SIR_CAN_MM' }]) }
//             },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } }
//         ]
//     },
//     props: {
//         giftCardUsed: boolean('giftCardUsed', false),
//         isClosedRadio: boolean('isClosedRadio', false),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOSTLY_MUSIC_1_MONTH_OFFER),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', MOCK_MCP_RECURRING_QUOTE_MODEL)
//     }
// }));
//
// QUOTES_STORYBOOK_STORIES.add('Promotion Quote: Due Future', () => ({
//     component: OrderSummaryComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: { allPackageDescriptions: () => of([{ name: 'Mostly Music Select', packageName: 'SIR_CAN_MM' }]) }
//             },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } }
//         ]
//     },
//     props: {
//         giftCardUsed: boolean('giftCardUsed', false),
//         isClosedRadio: boolean('isClosedRadio', true),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOCK_OFFERS_DATA),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', MOCK_MCP_RECURRING_QUOTE_MODEL)
//     }
// }));
//
// QUOTES_STORYBOOK_STORIES.add('In Trial', () => ({
//     component: OrderSummaryComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: { allPackageDescriptions: () => of([{ name: 'Mostly Music Select', packageName: 'SIR_CAN_MM' }]) }
//             },
//             { provide: SharedEventTrackService, useValue: { track: () => {} } }
//         ]
//     },
//     props: {
//         giftCardUsed: boolean('giftCardUsed', false),
//         isClosedRadio: boolean('isClosedRadio', true),
//         isNewAccount: boolean('isNewAccount', false),
//         offersData: object('offersData', MOCK_OFFERS_DATA),
//         offerDeal: object('offerDeal', { type: 'AMZ_DOT' }),
//         quote: object('quote', IN_TRIAL_MOCK)
//     }
// }));
