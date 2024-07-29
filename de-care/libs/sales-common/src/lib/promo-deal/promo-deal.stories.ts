// TODO: STORYBOOK_AUDIT

// import { object, withKnobs } from '@storybook/addon-knobs';
// import { DataOfferService, OfferDealModel } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { PromoDealComponent } from './promo-deal.component';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { SalesCommonModule } from '../sales-common.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SxmUiModule } from '@de-care/sxm-ui';
//
// const stories = storiesOf('sales-common/promo-deal', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [BrowserAnimationsModule, SalesCommonModule, SxmUiModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 {
//                                     name: 'Amazon Echo Dot',
//                                     packageName: 'AMZ_DOT',
//                                     header: 'FREE AMAZON ECHO DOT',
//                                     footer: '',
//                                     promoFooter: null,
//                                     description: null,
//                                     channels: [
//                                         {
//                                             title: '<b>Get an Amazon Echo Dot with subscription.</b>',
//                                             descriptions: [
//                                                 'Receive a free Amazno Echo Dot (3rd generation)',
//                                                 'Enjoy SiriusXM in your home with Amazon Alexa',
//                                                 'Tune to channels using just your voice'
//                                             ]
//                                         }
//                                     ],
//                                     packageDiff: null
//                                 },
//                                 {
//                                     name: 'Google Nest Mini',
//                                     packageName: 'GGLE_MINI',
//                                     header: 'GOOGLE NEST MINI',
//                                     footer: '',
//                                     promoFooter: null,
//                                     description: null,
//                                     channels: [
//                                         {
//                                             title: '<b>&ldquo;Hey Google, play Hits 1 on SiriusXM.&rdquo;</b>',
//                                             upsellTitle: '<b>Google Nest Mini included with your subscription.</b>',
//                                             descriptions: [
//                                                 'Receive a free Google Nest Mini',
//                                                 'Enjoy SiriusXM in your home with Google Assistant',
//                                                 'Tune to channels using just your voice'
//                                             ]
//                                         }
//                                     ],
//                                     packageDiff: null
//                                 }
//                             ])
//                     }
//                 }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('lead offer Amazon Dot', () => ({
//     component: PromoDealComponent,
//     props: {
//         deal: object('deal', {
//             type: 'AMZ_DOT'
//         } as OfferDealModel),
//         showDetails: true
//     }
// }));
//
// stories.add('lead offer Google Mini', () => ({
//     component: PromoDealComponent,
//     props: {
//         deal: object('deal', {
//             type: 'GGLE_MINI'
//         } as OfferDealModel),
//         showDetails: true
//     }
// }));
//
// stories.add('upsell offer Google Mini', () => ({
//     component: PromoDealComponent,
//     props: {
//         deal: object('deal', {
//             type: 'GGLE_MINI'
//         } as OfferDealModel),
//         cardType: 'upsell'
//     }
// }));
//
// stories.add('upsell offer Amazon Dot', () => ({
//     component: PromoDealComponent,
//     props: {
//         deal: object('deal', {
//             type: 'AMZ_DOT'
//         } as OfferDealModel),
//         cardType: 'upsell'
//     }
// }));
