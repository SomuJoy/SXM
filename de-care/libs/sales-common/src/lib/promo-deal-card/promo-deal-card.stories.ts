// TODO: STORYBOOK_AUDIT

// import { object, withKnobs } from '@storybook/addon-knobs';
// import { DataOfferService, OfferDealModel } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { PromoDealCardComponent } from './promo-deal-card.component';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { SalesCommonModule } from '../sales-common.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SxmUiModule } from '@de-care/sxm-ui';
//
// const stories = storiesOf('sales-common/promo-deal-card', module)
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
//                                                 'Receive a free Amazon Echo Dot (3rd generation)',
//                                                 'Enjoy SiriusXM in your home with Amazon Alexa',
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
// stories.add('default', () => ({
//     component: PromoDealCardComponent,
//     props: {
//         deal: object('deal', {
//             type: 'AMZ_DOT'
//         } as OfferDealModel)
//     }
// }));
