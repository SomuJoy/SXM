// TODO: STORYBOOK_AUDIT

// import { SettingsService } from '@de-care/settings';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withCommonDependencies, TRANSLATE_PROVIDERS_CA, TRANSLATE_PROVIDERS_CA_FR } from '@de-care/shared/storybook/util-helpers';
// import { DomainsOffersUiPromoCodeValidationFormModule } from '../domains-offers-ui-promo-code-validation-form.module';
// import { PromoCodeValidationComponent } from './promo-code-validation.component';
// import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
// import { of } from 'rxjs';
//
// const stories = storiesOf('Domains/Offers/promo-code-validation', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiPromoCodeValidationFormModule],
//             providers: [
//                 {
//                     provide: ValidatePromoCodeWorkflowService,
//                     useValue: {
//                         build: ({ promoCode }) => {
//                             switch (promoCode) {
//                                 case 'valid-promo-code':
//                                     return of('VALID');
//                                 case 'redeemed-promo-code':
//                                     return of('REDEEMED');
//                                 default:
//                                     return of('INVALID');
//                             }
//                         }
//                     }
//                 }
//             ]
//         })
//     )
//     .addDecorator(withCommonDependencies);
//
// stories.add('US-en Promo code validation', () => ({
//     component: PromoCodeValidationComponent,
//     props: {}
// }));
//
// stories.add('CA-en Promo code validation', () => ({
//     component: PromoCodeValidationComponent,
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
//     props: {}
// }));
//
// stories.add('CA-fr Promo code validation', () => ({
//     component: PromoCodeValidationComponent,
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
//     props: {}
// }));
