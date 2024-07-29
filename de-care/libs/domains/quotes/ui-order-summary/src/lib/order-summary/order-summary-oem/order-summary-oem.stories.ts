// TODO: STORYBOOK_AUDIT

// import { QUOTES_STORYBOOK_STORIES, MOCK_QUOTE_MODEL, MOCK_OFFERS_DATA } from '../../quotes.stories';
// import { OrderSummaryOemComponent } from './order-summary-oem.component';
// import { SharedEventTrackService } from '@de-care/data-layer';
// import { boolean, object } from '@storybook/addon-knobs';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// QUOTES_STORYBOOK_STORIES.add('order-summary: OEM', () => ({
//     component: OrderSummaryOemComponent,
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
