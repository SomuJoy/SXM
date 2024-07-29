// TODO: STORYBOOK_AUDIT

// import { OFFERS_STORYBOOK_STORIES } from './offers.stories';
// import { object } from '@storybook/addon-knobs';
// import { UserSettingsService } from '@de-care/settings';
// import { of } from 'rxjs';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { BetterPricingComponent } from '@de-care/offers';
//
// OFFERS_STORYBOOK_STORIES.add('better-pricing', () => ({
//     component: BetterPricingComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isQuebec$: of(false)
//                 }
//             }
//         ]
//     },
//     props: {
//         pricingInfo: object('@Input() pricingInfo', {
//             originalPrice: 15.99,
//             newPrice: 4.99,
//             originalTerm: '6',
//             newTerm: '8',
//             isFreeTrial: false
//         })
//     }
// }));
//
// OFFERS_STORYBOOK_STORIES.add('better-pricing: with Banner', () => ({
//     component: BetterPricingComponent,
//     moduleMetadata: {
//         imports: [SxmUiModule],
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isQuebec$: of(false)
//                 }
//             }
//         ]
//     },
//     props: {
//         pricingInfo: object('@Input() pricingInfo', {
//             originalPrice: 15.99,
//             newPrice: 4.99,
//             originalTerm: 6,
//             newTerm: 8,
//             isFreeTrial: false
//         })
//     },
//     template: `
//         <sxm-ui-banner>
//             <better-pricing
//                 [pricingInfo]="pricingInfo"
//             ></better-pricing>
//         </sxm-ui-banner>
//     `
// }));
//
// OFFERS_STORYBOOK_STORIES.add('better-pricing: in Quebec', () => ({
//     component: BetterPricingComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: UserSettingsService,
//                 useValue: {
//                     isQuebec$: of(true)
//                 }
//             }
//         ]
//     },
//     props: {
//         pricingInfo: object('@Input() pricingInfo', {
//             originalPrice: 15.99,
//             newPrice: 4.99,
//             originalTerm: '6',
//             newTerm: '8',
//             isFreeTrial: false
//         })
//     }
// }));
