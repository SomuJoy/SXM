// TODO: STORYBOOK_AUDIT

// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SettingsService } from '@de-care/settings';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { select, text, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { OffersModule } from '../offers.module';
// import { OfferNotAvailableConfirmationComponent } from './offer-not-available-confirmation.component';
//
// const stories = storiesOf('offers/offer-not-available-confirmation', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 {
//                     provide: SettingsService,
//                     useValue: { isCanadaMode: false }
//                 }
//             ]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: OfferNotAvailableConfirmationComponent,
//     props: {
//         offerNotAvailableReason: select(
//             '@Input() offerNotAvailableReason',
//             {
//                 EXPIRED: 'EXPIRED',
//                 TRIAL_RADIO_NOT_ELIGIBLE: 'TRIAL_RADIO_NOT_ELIGIBLE',
//                 MWB_MCP_UNAVAILABLE: 'MWB_MCP_UNAVAILABLE',
//                 OTHERS: 'OTHERS',
//                 NONE: 'NONE'
//             },
//             'EXPIRED'
//         ),
//         continueRequested: action('@Output() continueRequested')
//     }
// }));
//
// stories.add('in Canada', () => ({
//     component: OfferNotAvailableConfirmationComponent,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: { isCanadaMode: true }
//             }
//         ]
//     },
//     props: {
//         offerNotAvailableReason: text('@Input() offerNotAvailableReason', 'EXPIRED'),
//         continueRequested: action('@Output() continueRequested')
//     }
// }));
