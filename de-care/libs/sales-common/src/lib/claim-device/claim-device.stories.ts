// TODO: STORYBOOK_AUDIT

// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { object, withKnobs } from '@storybook/addon-knobs';
// import { DataOfferService, OfferDealModel } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { ClaimDeviceComponent } from './claim-device.component';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { SalesCommonModule } from '../sales-common.module';
//
// const stories = storiesOf('sales-common/claim-device', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [SalesCommonModule],
//             providers: [
//                 {
//                     provide: DataOfferService,
//                     useValue: {
//                         allPackageDescriptions: () =>
//                             of([
//                                 {
//                                     name: 'Amazon Echo Dot',
//                                     company: 'Amazon',
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
//                                     packageDiff: null,
//                                     linkWithSiteSupported: true
//                                 },
//                                 {
//                                     name: 'Google Nest Hub',
//                                     company: 'Google',
//                                     packageName: 'GGLE_HUB',
//                                     header: 'GOOGLE NEST HUB',
//                                     footer: '',
//                                     promoFooter: null,
//                                     description: null,
//                                     channels: [
//                                         {
//                                             title: '<b>Get a Google Nest Hub with subscription.</b>',
//                                             descriptions: ['Enjoy SiriusXM in your home with a Google Nest Hub', 'Tune to channels using just your voice']
//                                         }
//                                     ],
//                                     packageDiff: null,
//                                     linkWithSiteSupported: false
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
//                                             title: '<b>“Hey Google, play Hits 1 on SiriusXM.”</b>',
//                                             descriptions: [
//                                                 'Receive a free Google Nest Mini',
//                                                 'Enjoy SiriusXM in your home with Google Assistant',
//                                                 'Tune to channels using just your voice'
//                                             ]
//                                         }
//                                     ],
//                                     packageDiff: null
//                                 },
//                                 {
//                                     name: 'Pandora Premium',
//                                     company: 'Pandora',
//                                     packageName: 'PANDORA',
//                                     channelLineUpURL: null,
//                                     header: 'PLUS PANDORA PREMIUM',
//                                     linkWithSiteSupported: true,
//                                     footer: '',
//                                     promoFooter: null,
//                                     description: null,
//                                     channels: [
//                                         {
//                                             title: '<b>Includes Pandora Premium for 2 months free.</b>',
//                                             upsellTitle: null,
//                                             count: null,
//                                             descriptions: ['Ad-free personalized music', 'Search and play anything', 'Unlimited skips', 'Unlimited offline listening'],
//                                             features: null
//                                         }
//                                     ],
//                                     packageDiff: null
//                                 },
//                                 {
//                                     name: 'Hulu',
//                                     packageName: 'HULU',
//                                     header: 'HULU',
//                                     footer: '',
//                                     promoFooter: null,
//                                     description: null,
//                                     channels: [
//                                         {
//                                             title: '<b>3 months of Hulu</b>',
//                                             descriptions: [
//                                                 "Buzzworthy Hulu originals like The Handmaid's Tale, Little Fires Everywhere, and Solar Opposites",
//                                                 'Brand New FX on Hulu shows',
//                                                 'All the TV you love'
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
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('With Link: Amazon: Claim state', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'AMZ_DOT'
//         } as OfferDealModel),
//         hasLink: true,
//         platform: 'SiriusXM',
//         state: 'claim'
//     }
// }));
//
// stories.add('With Link: Amazon: Success state', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'AMZ_DOT'
//         } as OfferDealModel),
//         hasLink: true,
//         platform: 'SiriusXM',
//         state: 'success'
//     }
// }));
//
// stories.add('With Link: Amazon: Error state', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'AMZ_DOT'
//         } as OfferDealModel),
//         hasLink: true,
//         platform: 'SiriusXM',
//         state: 'error'
//     }
// }));
//
// stories.add('With Link: Pandora', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'PANDORA'
//         } as OfferDealModel)
//     }
// }));
//
// stories.add('Without Link: Google Hub', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'GGLE_HUB'
//         } as OfferDealModel)
//     }
// }));
//
// stories.add('Without Link: Google Mini', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'GGLE_MINI'
//         } as OfferDealModel)
//     }
// }));
//
// stories.add('Without Link: Hulu', () => ({
//     component: ClaimDeviceComponent,
//     props: {
//         deal: object('deal', {
//             type: 'HULU'
//         } as OfferDealModel)
//     }
// }));
