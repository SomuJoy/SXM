// TODO: STORYBOOK_AUDIT

// import { ChargeAgreementComponent } from './../charge-agreement/charge-agreement.component';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { of } from 'rxjs';
// import { REVIEW_ORDER_STORIES } from '../review-order.stories';
//
// REVIEW_ORDER_STORIES.add('charge-agreement', () => ({
//     component: ChargeAgreementComponent,
//     props: {
//         details: {}
//     }
// }));
//
// REVIEW_ORDER_STORIES.add('charge-agreement: with eft', () => ({
//     component: ChargeAgreementComponent,
//     props: {
//         details: {
//             etf: 50,
//             etfTerm: 6
//         }
//     }
// }));
//
// REVIEW_ORDER_STORIES.add('charge-agreement: is canada mode', () => ({
//     component: ChargeAgreementComponent,
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true } }]
//     },
//     props: {
//         details: {}
//     }
// }));
//
// REVIEW_ORDER_STORIES.add('charge-agreement: is quebec', () => ({
//     component: ChargeAgreementComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             { provide: UserSettingsService, useValue: { isQuebec$: of(true) } }
//         ]
//     },
//     props: {
//         details: {}
//     }
// }));
//
// REVIEW_ORDER_STORIES.add('charge-agreement: with long term offer', () => ({
//     component: ChargeAgreementComponent,
//     props: {
//         details: {
//             isLongTerm: true
//         }
//     }
// }));
