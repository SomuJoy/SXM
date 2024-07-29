// TODO: STORYBOOK_AUDIT

// import { PurchaseModule } from '../../purchase.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { MOCK_NGRX_STORE_PROVIDER, withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
// import { ReviewOrderModule } from '@de-care/review-order';
// import { ReviewOrderComponent } from './review-order.component';
//
// const stories = storiesOf('purchase/review-order', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [PurchaseModule, DomainsQuotesUiOrderSummaryModule, ReviewOrderModule],
//             providers: [MOCK_NGRX_STORE_PROVIDER]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: ReviewOrderComponent,
//     props: {
//         // Sample reviewObject for now that gets component to render without errors.
//         reviewObject: {
//             email: '',
//             packages: [
//                 {
//                     quote: null
//                 }
//             ],
//             giftCard: {
//                 balance: null
//             },
//             address: {
//                 filled: false
//             },
//             paymentInfo: {
//                 ccSaved: false
//             }
//         },
//         stepNumber: 3
//     }
// }));
