// TODO: STORYBOOK_AUDIT

// import { SharedEventTrackService } from '@de-care/data-layer';
// import { DataOfferService } from '@de-care/data-services';
// import { boolean, object } from '@storybook/addon-knobs';
// import { of } from 'rxjs';
// import { QUOTES_STORYBOOK_STORIES, QUOTES_STORYBOOK_STORIES_CA } from '../../quotes.stories';
// import {
//     CYPRESS_QUOTE_MOCK,
//     CYPRESS_MCP_QUOTE_MOCK,
//     CYPRESS_STREAMING_QUOTE_MOCK,
//     CYPRESS_CREDITONACCOUNT_QUOTE_MOCK,
//     CYPRESS_GIFTCARD_QUOTE_MOCK,
//     CYPRESS_QUOTE_MOCK_CANADA_ROC,
//     CYPRESS_QUOTE_MOCK_CANADA_QC,
//     CYPRESS_PROMOPLAN_QUOTE_MOCK,
//     CYPRESS_PROMOMCP_QUOTE_MOCK,
//     CYPRESS_ACCOUNTBALANCE_QUOTE_MOCK,
//     CYPRESS_MRD_QUOTE_MOCK,
//     CYPRESS_PROMOPLAN_CANADA_ROC_QUOTE_MOCK,
//     CYPRESS_MCP_CANADA_ROC_QUOTE_MOCK,
//     CYPRESS_MRD_CANADA_ROC_QUOTE_MOCK,
//     CYPRESS_PROMOPLAN_CANADA_QC_QUOTE_MOCK,
//     CYPRESS_MEGAWINBACK_QUOTE_MOCK,
//     CYPRESS_MEGAWINBACK_CANADA_ROC_QUOTE_MOCK,
//     CYPRESS_MEGAWINBACK_MCP_CANADA_ROC_QUOTE_MOCK,
//     CYPRESS_MEGAWINBACK_MCP_CANADA_QC_QUOTE_MOCK,
//     CYPRESS_MEGAWINBACK_CANADA_QC_QUOTE_MOCK
// } from './mock-cypress-quotes.stories';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { QuoteSummaryComponent } from '../quote-summary/quote-summary.component';
// import { Type } from '@angular/core';
// import { OrderSummaryComponent } from '../order-summary.component';
//
// const configGenMain = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary', configGenMain(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-refactored', configGenMain(QuoteSummaryComponent));
//
// const configGenPromoPlan = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', true),
//             quote: object('quote', CYPRESS_PROMOPLAN_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-promoplan', configGenPromoPlan(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-promoplan-refactored', configGenPromoPlan(QuoteSummaryComponent));
//
// const configGenMCP = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MCP_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-mcp', configGenMCP(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-mcp-refactored', configGenMCP(QuoteSummaryComponent));
//
// const configGenPromoMCP = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 { name: 'Sirius Select Lite', packageName: 'SIR_AUD_EVT_LT' },
//                                 { name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }
//                             ])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', true),
//             quote: object('quote', CYPRESS_PROMOMCP_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-promomcp', configGenPromoMCP(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-promomcp-refactored', configGenPromoMCP(QuoteSummaryComponent));
//
// const configGenStreaming = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'SiriusXM Essential Streaming', packageName: 'SIR_IP_SA_ESNTL' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', true),
//             isStreamingFlow: boolean('isStreamingFlow', true),
//             quote: object('quote', CYPRESS_STREAMING_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-streaming', configGenStreaming(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-streaming-refactored', configGenStreaming(QuoteSummaryComponent));
//
// const configGenCreditOnAccount = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_CREDITONACCOUNT_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-creditonaccount', configGenCreditOnAccount(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-creditonaccount-refactored', configGenCreditOnAccount(QuoteSummaryComponent));
//
// const configGenGiftCard = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_GIFTCARD_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-giftcard', configGenGiftCard(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-giftcard-refactored', configGenGiftCard(QuoteSummaryComponent));
//
// const configGenInCanadaROC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_CAN_EVT' }])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => false,
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_QUOTE_MOCK_CANADA_ROC)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary - in Canada (ROC)', configGenInCanadaROC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary - in Canada (ROC)-refactored', configGenInCanadaROC(QuoteSummaryComponent));
//
// const configGenInCanadaQC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_CAN_EVT' }])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => true,
//                         isQuebec$: of(true),
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_QUOTE_MOCK_CANADA_QC)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary - in Canada (QC)', configGenInCanadaQC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary - in Canada (QC)-refactored', configGenInCanadaQC(QuoteSummaryComponent));
//
// const configGenAccountBalance = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'XM Select', packageName: '1_SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', true),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_ACCOUNTBALANCE_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-accountbalance', configGenAccountBalance(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-accountbalance-refactored', configGenAccountBalance(QuoteSummaryComponent));
//
// const configGenMRD = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', true),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MRD_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-mrd', configGenMRD(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-mrd-refactored', configGenMRD(QuoteSummaryComponent));
//
// const configGenPromoPlanInCanadaROC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_CAN_EVT' }])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => false,
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', true),
//             quote: object('quote', CYPRESS_PROMOPLAN_CANADA_ROC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-promoplan - in Canada (ROC)', configGenPromoPlanInCanadaROC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-promoplan - in Canada (ROC)-refactored', configGenPromoPlanInCanadaROC(QuoteSummaryComponent));
//
// const configGenMCPInCanadaROC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_CAN_EVT' }])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => false,
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', true),
//             quote: object('quote', CYPRESS_MCP_CANADA_ROC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-mcp - in Canada (ROC)', configGenMCPInCanadaROC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-mcp - in Canada (ROC)-refactored', configGenMCPInCanadaROC(QuoteSummaryComponent));
//
// const configGenMRDInCanadaROC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_CAN_EVT' }])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => false,
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', true),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MRD_CANADA_ROC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-mrd - in Canada (ROC)', configGenMRDInCanadaROC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-mrd - in Canada (ROC)-refactored', configGenMRDInCanadaROC(QuoteSummaryComponent));
//
// const configGenPromoPlanInCanadaQC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () => of([{ name: 'Sirius Select', packageName: 'SIR_CAN_EVT' }])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => true,
//                         isQuebec$: of(true),
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', true),
//             isCanada: boolean('isCanada', true),
//             quote: object('quote', CYPRESS_PROMOPLAN_CANADA_QC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-promoplan - in Canada (QC)', configGenPromoPlanInCanadaQC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-promoplan - in Canada (QC)-refactored', configGenPromoPlanInCanadaQC(QuoteSummaryComponent));
//
// const configGenMegaWinBack = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 { name: 'Sirius Select', packageName: 'SIR_AUD_EVT' },
//                                 { name: 'Echo Dot', packageName: 'AMZ_DOT' }
//                             ])
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MEGAWINBACK_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-megawinback', configGenMegaWinBack(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES.add('cypress-order-summary-megawinback-refactored', configGenMegaWinBack(QuoteSummaryComponent));
//
// const configGenMegaWinBackInCanadaROC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 { name: 'Sirius Select', packageName: 'SIR_CAN_EVT' },
//                                 { name: 'Amazon Echo Dot', packageName: 'AMZ_DOT' }
//                             ])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => false,
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MEGAWINBACK_CANADA_ROC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback - in Canada (ROC)', configGenMegaWinBackInCanadaROC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback - in Canada (ROC)-refactored', configGenMegaWinBackInCanadaROC(QuoteSummaryComponent));
//
// const configGenMegaWinBackMCPInCanadaROC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 { name: 'Sirius Select', packageName: 'SIR_CAN_EVT' },
//                                 { name: 'Amazon Echo Dot', packageName: 'AMZ_DOT' }
//                             ])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => false,
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', true),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MEGAWINBACK_MCP_CANADA_ROC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback-mcp - in Canada (ROC)', configGenMegaWinBackMCPInCanadaROC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback-mcp - in Canada (ROC)-refactored', configGenMegaWinBackMCPInCanadaROC(QuoteSummaryComponent));
//
// const configGenMegaWinBackMCPInCanadaQC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 { name: 'Sirius Select', packageName: 'SIR_CAN_EVT' },
//                                 { name: 'Amazon Echo Dot', packageName: 'AMZ_DOT' }
//                             ])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => true,
//                         isQuebec$: of(true),
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', true),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MEGAWINBACK_MCP_CANADA_QC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback-mcp - in Canada (QC)', configGenMegaWinBackMCPInCanadaQC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback-mcp - in Canada (QC)-refactored', configGenMegaWinBackMCPInCanadaQC(QuoteSummaryComponent));
//
// const configGenMegaWinBackInCanadaQC = (component: Type<any>) => () => {
//     return {
//         component: component,
//         moduleMetadata: {
//             providers: [
//                 { provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } },
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 { name: 'Sirius Select', packageName: 'SIR_CAN_EVT' },
//                                 { name: 'Amazon Echo Dot', packageName: 'AMZ_DOT' }
//                             ])
//                     }
//                 },
//                 {
//                     provide: UserSettingsService,
//                     useValue: {
//                         isQuebec: () => true,
//                         isQuebec$: of(true),
//                         dateFormat: 'MMMM d, y',
//                         dateFormat$: of('MMMM d, y'),
//                         setProvinceSelectionVisible: () => false,
//                         language: 'en-CA'
//                     }
//                 },
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } }
//             ]
//         },
//         props: {
//             giftCardUsed: boolean('giftCardUsed', false),
//             isClosedRadio: boolean('isClosedRadio', false),
//             isNewAccount: boolean('isNewAccount', false),
//             quote: object('quote', CYPRESS_MEGAWINBACK_CANADA_QC_QUOTE_MOCK)
//         }
//     };
// };
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback - in Canada (QC)', configGenMegaWinBackInCanadaQC(OrderSummaryComponent));
// QUOTES_STORYBOOK_STORIES_CA.add('cypress-order-summary-megawinback - in Canada (QC)-refactored', configGenMegaWinBackInCanadaQC(QuoteSummaryComponent));
