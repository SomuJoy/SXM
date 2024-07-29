// TODO: STORYBOOK_AUDIT

// import { DataGiftCardService } from '@de-care/domains/payment/state-gift-card';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation, withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
// import { CoreLoggerService, SharedEventTrackService } from '@de-care/data-layer';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { of } from 'rxjs';
// import { PrepaidRedeemComponent } from './prepaid-redeem.component';
// import { action } from '@storybook/addon-actions';
// import { DomainsPaymentUiPrepaidRedeemModule } from '../domains-payment-ui-prepaid-redeem.module';
//
// const stories = storiesOf('domains/payment/ui-prepaid-redeem/prepaid-redeem', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsPaymentUiPrepaidRedeemModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 { provide: SharedEventTrackService, useValue: { track: () => {} } },
//                 { provide: CoreLoggerService, useValue: { debug: () => {} } }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('with successful redeem', () => ({
//     component: PrepaidRedeemComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataGiftCardService,
//                 useValue: {
//                     redeemPrepaidCard: () => of({ isSuccess: true, amount: 100 }),
//                     removePrepaidCard: () => of('SUCCESS')
//                 }
//             }
//         ]
//     },
//     props: {
//         cardSubmitted: action('@Output() cardSubmitted emitted'),
//         cardCleared: action('@Output() cardCleared emitted')
//     }
// }));
//
// stories.add('with failed redeem due to invalid card', () => ({
//     component: PrepaidRedeemComponent,
//     moduleMetadata: {
//         providers: [{ provide: DataGiftCardService, useValue: { redeemPrepaidCard: () => of({ isSuccess: false }), removePrepaidCard: () => of('SUCCESS') } }]
//     },
//     props: {
//         cardSubmitted: action('@Output() cardSubmitted emitted'),
//         cardCleared: action('@Output() cardCleared emitted')
//     }
// }));
//
// stories.add('with failed redeem due to no remaining balance', () => ({
//     component: PrepaidRedeemComponent,
//     moduleMetadata: {
//         providers: [{ provide: DataGiftCardService, useValue: { redeemPrepaidCard: () => of({ isSuccess: true, amount: 0 }), removePrepaidCard: () => of('SUCCESS') } }]
//     },
//     props: {
//         cardSubmitted: action('@Output() cardSubmitted emitted'),
//         cardCleared: action('@Output() cardCleared emitted')
//     }
// }));
