// TODO: STORYBOOK_AUDIT

// import { AmazonLoginService } from '@de-care/domains/subscriptions/state-amazon-linking';
// import { provideMockStore } from '@ngrx/store/testing';
// import { of } from 'rxjs';
// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { CheckoutModule } from './checkout.module';
// import { CHECKOUT_CONSTANT } from '@de-care/checkout-state';
// import { DataOfferService, DataValidationService } from '@de-care/data-services';
// import { PurchaseStateConstant } from '@de-care/purchase-state';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { mockSatelliteAccount, mockSatelliteRadioOffer, mockStreamingAccount, mockStreamingOffer } from './mocks';
// import { ThanksComponent } from './thanks/thanks.component';
//
// const buildMockStoreProvider = (offer, account, isOfferStreamingEligible = false) => {
//     return {
//         [PurchaseStateConstant.STORE.NAME]: {
//             reviewOrder: { agreement: true },
//             prepaidCard: null,
//             data: {
//                 offer: { offers: [{ planCode: offer.planCode, type: offer.type, termLength: offer.termLength }] },
//                 isOfferStreamingEligible
//             },
//             serviceError: false
//         },
//
//         [CHECKOUT_CONSTANT.STORE.NAME]: {
//             offer: { offers: [offer] },
//             account,
//             securityQuestions: [
//                 { id: 101, question: 'Favorite place to visit' },
//                 { id: 102, question: 'First phone number' },
//                 { id: 103, question: 'Favorite sports team' }
//             ],
//             registrationError: null,
//             loading: false
//         }
//     };
// };
//
// const mockSelectors = [
//     {
//         selector: 'getIsRtc',
//         value: false
//     }
// ];
//
// const stories = storiesOf('checkout/thanks', module)
//     .addDecorator(withKnobs)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [CheckoutModule],
//             providers: [{ provide: DataValidationService, useValue: { validateUserName: of({ valid: true }) } }]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('satellite radio subscription', () => ({
//     component: ThanksComponent,
//     moduleMetadata: {
//         providers: [
//             provideMockStore({ initialState: buildMockStoreProvider(mockSatelliteRadioOffer, mockSatelliteAccount), selectors: mockSelectors }),
//             { provide: AmazonLoginService, useValue: {} },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         if (locale === 'fr_CA') {
//                             return of([{ name: 'FR:: Sirius Select', packageName: 'SIR_AUD_EVT' }]);
//                         } else {
//                             return of([{ name: 'Sirius Select', packageName: 'SIR_AUD_EVT' }]);
//                         }
//                     }
//                 }
//             }
//         ]
//     }
// }));
//
// stories.add('streaming subscription', () => ({
//     component: ThanksComponent,
//     moduleMetadata: {
//         providers: [
//             provideMockStore({ initialState: buildMockStoreProvider(mockStreamingOffer, mockStreamingAccount, true), selectors: mockSelectors }),
//             { provide: AmazonLoginService, useValue: {} },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         if (locale === 'fr_CA') {
//                             return of([{ name: 'FR:: SiriusXM Essential Streaming', packageName: 'SIR_IP_SA_ESNTL' }]);
//                         } else {
//                             return of([{ name: 'SiriusXM Essential Streaming', packageName: 'SIR_IP_SA_ESNTL' }]);
//                         }
//                     }
//                 }
//             }
//         ]
//     }
// }));
