// TODO: STORYBOOK_AUDIT

// import { PriceChangeMessagingType } from './price-change-messaging-type-enum';
// import { SettingsService } from '@de-care/settings';
// import { PriceIncreaseMessageComponent } from './price-increase-message.component';
// import { DomainsOffersUiPriceIncreaseMessageModule } from './../domains-offers-ui-price-increase-message.module';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withCommonDependencies, withTranslation, TRANSLATE_PROVIDERS_CA, TRANSLATE_PROVIDERS_CA_FR } from '@de-care/shared/storybook/util-helpers';
//
// const stories = storiesOf('Domains/Offers/price-increase-message', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiPriceIncreaseMessageModule]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('US-en MSRP', () => ({
//     component: PriceIncreaseMessageComponent,
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MSRP,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-en MRF', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRF,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-en MRD_MRF', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-en MRD_MRF_AA_MM', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF_AA_MM,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-en MRF_QUEBEC', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRF,
//         isQuebec: true
//     }
// }));
//
// stories.add('CA-en MRD_MRF_QUEBEC', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF,
//         isQuebec: true
//     }
// }));
//
// stories.add('CA-en MRD_MRF_AA_MM_QUEBEC', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF_AA_MM,
//         isQuebec: true
//     }
// }));
//
// stories.add('CA-fr MRF', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA_FR,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRF,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-fr MRD_MRF', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA_FR,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-fr MRD_MRF_AA_MM', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA_FR,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF_AA_MM,
//         isQuebec: false
//     }
// }));
//
// stories.add('CA-fr MRF_QUEBEC', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA_FR,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRF,
//         isQuebec: true
//     }
// }));
//
// stories.add('CA-fr MRD_MRF_QUEBEC', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA_FR,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF,
//         isQuebec: true
//     }
// }));
//
// stories.add('CA-fr MRD_MRF_AA_MM_QUEBEC', () => ({
//     component: PriceIncreaseMessageComponent,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA_FR,
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         priceChangeMessagingType: PriceChangeMessagingType.MRD_MRF_AA_MM,
//         isQuebec: true
//     }
// }));
