// TODO: STORYBOOK_AUDIT

// import { action } from '@storybook/addon-actions';
// import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
// import { DomainsOffersUiGroupedOfferCardFormFieldModule, UIGroupedOfferCardFormFieldComponent } from '@de-care/domains/offers/ui-grouped-offer-card-form-field';
// import { of } from 'rxjs';
// import { DataOfferService, isOfferMCP, PlanTypeEnum } from '@de-care/data-services';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs, boolean } from '@storybook/addon-knobs';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SettingsService } from '@de-care/settings';
// import { OffersModule } from '@de-care/offers';
//
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { Offer } from '@de-care/domains/offers/state-offers';
// import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
//
// const parentOffer: OfferInfo = {
//     packageName: 'SIR_AUD_CHOICE',
//     pricePerMonth: 7.99,
//     retailPrice: 7.99,
//     termLength: 1,
//     price: 7.99,
//     isMCP: isOfferMCP(PlanTypeEnum.SelfPay),
//     offerType: PlanTypeEnum.SelfPay,
//     minimumFollowOnTerm: 0,
//     processingFee: null,
//     deal: null,
//     isStreaming: false,
//     isUpgradePromo: false
// };
//
// const choicePackageDescription = {
//     name: 'Sirius Choice',
//     packageName: 'SIR_AUD_CHOICE',
//     header: "Enjoy 51 channels of music & talk. Plus, you'll get 3 more channels from the genre of your choice:",
//     channels: [
//         {
//             title: '<b>SiriusXM Choice Includes:</b>',
//             descriptions: ['54 channels in your car, on your phone, at home, and online', 'Ad-free music.....', 'Include 3 bonus channels.....']
//         }
//     ],
//     footer: null
// };
//
// const packageOptions: Offer[] = [
//     {
//         planCode: 'Choice Country - 12mo',
//         packageName: 'SIR_AUD_CHOICE_CTRY',
//         promoCode: 'PEGAOAC',
//         termLength: 12,
//         type: 'SELF_PAY',
//         marketType: 'self-pay:standard',
//         price: 95.88,
//         pricePerMonth: 7.99,
//         retailPrice: 95.88,
//         msrpPrice: 95.88,
//         processingFee: null,
//         supportedServices: ['ESN', 'SIR', 'UNIVERSAL_LOGIN'],
//         deal: null,
//         priceChangeMessagingType: '',
//         planEndDate: null,
//         fallbackReason: null,
//         minimumFollowOnTerm: 0,
//         order: 3,
//         mrdEligible: false,
//         fallback: false,
//         streaming: false,
//         upgradeOffer: false
//     },
//     {
//         planCode: 'Choice Hip-Hop/R&B - 12mo',
//         packageName: 'SIR_AUD_CHOICE_HH',
//         promoCode: 'PEGAOAC',
//         termLength: 12,
//         type: 'SELF_PAY',
//         marketType: 'self-pay:standard',
//         price: 95.88,
//         pricePerMonth: 7.99,
//         retailPrice: 95.88,
//         msrpPrice: 95.88,
//         processingFee: null,
//         supportedServices: ['ESN', 'SIR', 'UNIVERSAL_LOGIN'],
//         deal: null,
//         priceChangeMessagingType: '',
//         planEndDate: null,
//         fallbackReason: null,
//         minimumFollowOnTerm: 0,
//         order: 3,
//         mrdEligible: false,
//         fallback: false,
//         streaming: false,
//         upgradeOffer: false
//     },
//     {
//         planCode: 'Choice Pop - 12mo',
//         packageName: 'SIR_AUD_CHOICE_POP',
//         promoCode: 'PEGAOAC',
//         termLength: 12,
//         type: 'SELF_PAY',
//         marketType: 'self-pay:standard',
//         price: 95.88,
//         pricePerMonth: 7.99,
//         retailPrice: 95.88,
//         msrpPrice: 95.88,
//         processingFee: null,
//         supportedServices: ['ESN', 'SIR', 'UNIVERSAL_LOGIN'],
//         deal: null,
//         priceChangeMessagingType: '',
//         planEndDate: null,
//         fallbackReason: null,
//         minimumFollowOnTerm: 0,
//         order: 3,
//         mrdEligible: false,
//         fallback: false,
//         streaming: false,
//         upgradeOffer: false
//     },
//     {
//         planCode: 'Choice Classic Rock - 12mo',
//         packageName: 'SIR_AUD_CHOICE_CLROCK',
//         promoCode: 'PEGAOAC',
//         termLength: 12,
//         type: 'SELF_PAY',
//         marketType: 'self-pay:standard',
//         price: 95.88,
//         pricePerMonth: 7.99,
//         retailPrice: 95.88,
//         msrpPrice: 95.88,
//         processingFee: null,
//         supportedServices: ['ESN', 'SIR', 'UNIVERSAL_LOGIN'],
//         deal: null,
//         priceChangeMessagingType: '',
//         planEndDate: null,
//         fallbackReason: null,
//         minimumFollowOnTerm: 0,
//         order: 3,
//         mrdEligible: false,
//         fallback: false,
//         streaming: false,
//         upgradeOffer: false
//     },
//     {
//         planCode: 'Choice Current Rock - 12mo',
//         packageName: 'SIR_AUD_CHOICE_ROCK',
//         promoCode: 'PEGAOAC',
//         termLength: 12,
//         type: 'SELF_PAY',
//         marketType: 'self-pay:standard',
//         price: 95.88,
//         pricePerMonth: 7.99,
//         retailPrice: 95.88,
//         msrpPrice: 95.88,
//         processingFee: null,
//         supportedServices: ['ESN', 'SIR', 'UNIVERSAL_LOGIN'],
//         deal: null,
//         priceChangeMessagingType: '',
//         planEndDate: null,
//         fallbackReason: null,
//         minimumFollowOnTerm: 0,
//         order: 3,
//         mrdEligible: false,
//         fallback: false,
//         streaming: false,
//         upgradeOffer: false
//     }
// ];
//
// export const mockPackageDescriptionsProvider = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'en_US') {
//                 return of([
//                     {
//                         name: 'Sirius Country',
//                         company: null,
//                         packageName: 'SIR_AUD_CHOICE_CTRY',
//                         channelLineUpURL: null,
//                         header: null,
//                         linkWithSiteSupported: null,
//                         footer: null,
//                         promoFooter: null,
//                         description: null,
//                         channels: [
//                             {
//                                 title: 'Country channels:',
//                                 descriptions: ['Prime Country', 'The Highway', 'Y2Kountry']
//                             }
//                         ],
//                         packageDiff: null,
//                         parentPackageName: 'SIR_AUD_CHOICE'
//                     },
//                     {
//                         name: 'Sirius Hip-Hop/R&B',
//                         company: null,
//                         packageName: 'SIR_AUD_CHOICE_HH',
//                         channelLineUpURL: null,
//                         header: null,
//                         linkWithSiteSupported: null,
//                         footer: null,
//                         promoFooter: null,
//                         description: null,
//                         channels: [
//                             {
//                                 title: 'Hip-Hop/R&B channels:',
//                                 descriptions: ['HipHopNation', 'The Heat', 'SXMFly']
//                             }
//                         ],
//                         packageDiff: null,
//                         parentPackageName: 'SIR_AUD_CHOICE'
//                     },
//                     {
//                         name: 'Sirius Pop',
//                         company: null,
//                         packageName: 'SIR_AUD_CHOICE_POP',
//                         channelLineUpURL: null,
//                         header: null,
//                         linkWithSiteSupported: null,
//                         footer: null,
//                         promoFooter: null,
//                         description: null,
//                         channels: [
//                             {
//                                 title: 'Pop channels:',
//                                 descriptions: ['The Pulse', 'SXM Hits 1', 'PopRocks']
//                             }
//                         ],
//                         packageDiff: null,
//                         parentPackageName: 'SIR_AUD_CHOICE'
//                     },
//                     {
//                         name: 'Sirius Classic Rock',
//                         company: null,
//                         packageName: 'SIR_AUD_CHOICE_CLROCK',
//                         channelLineUpURL: null,
//                         header: null,
//                         linkWithSiteSupported: null,
//                         footer: null,
//                         promoFooter: null,
//                         description: null,
//                         channels: [
//                             {
//                                 title: 'Classic Rock channels:',
//                                 descriptions: ['Classic Rewind', 'Classic Vinyl', 'Lithium']
//                             }
//                         ],
//                         packageDiff: null,
//                         parentPackageName: 'SIR_AUD_CHOICE'
//                     },
//                     {
//                         name: 'Sirius Current Rock',
//                         company: null,
//                         packageName: 'SIR_AUD_CHOICE_ROCK',
//                         channelLineUpURL: null,
//                         header: null,
//                         linkWithSiteSupported: null,
//                         footer: null,
//                         promoFooter: null,
//                         description: null,
//                         channels: [
//                             {
//                                 title: 'Current Rock channels:',
//                                 descriptions: ['Altnation', 'Octane', 'SXM Turbo']
//                             }
//                         ],
//                         packageDiff: null,
//                         parentPackageName: 'SIR_AUD_CHOICE'
//                     },
//                     {
//                         name: 'Sirius Choice',
//                         packageName: 'SIR_AUD_CHOICE',
//                         channelLineUpURL: null,
//                         header: "Enjoy 51 channels of music & talk. Plus, you'll get 3 more channels from the genre of your choice:",
//                         linkWithSiteSupported: null,
//                         footer: null,
//                         promoFooter: null,
//                         description: null,
//                         channels: [
//                             {
//                                 title: '<b>Sirius Choice Includes:</b>',
//                                 descriptions: [
//                                     '54 channels in your car, on your phone, at home, and online',
//                                     'Ad-free music, select news, talk and entertainment channels',
//                                     'Includes 3 bonus channels in Country, Hip-Hop/R&B, Pop, Classic Rock, or Current Rock'
//                                 ]
//                             }
//                         ],
//                         packageDiff: null,
//                         parentPackageName: null
//                     }
//                 ]);
//             } else if (locale === 'fr_CA') {
//                 return of([]);
//             }
//         }
//     }
// };
//
// const stories = storiesOf('Domains/Offers/GroupedOfferCardFormField', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule]
//         })
//     )
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         imports: [BrowserAnimationsModule, ReactiveFormsModule, SxmUiModule, DomainsOffersUiGroupedOfferCardFormFieldModule],
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: false } }, mockPackageDescriptionsProvider]
//     },
//     component: UIGroupedOfferCardFormFieldComponent,
//     template: `
//         <form [formGroup]="choiceForm" (ngSubmit)="submitChoiceForm(choiceForm.value)">
//             <ui-grouped-offer-card-form-field
//                 formControlName="choice"
//                 [parentOffer]="parentOffer"
//                 [packageDescription]="packageDescription"
//                 [packageOptions]="packageOptions"
//                 [isRTC]="isRTC"
//                 [excludePriceAndTermDisplay]="excludePriceAndTermDisplay"
//                 [flagPresent]="flagPresent"
//                 [headlinePresent]="headlinePresent"
//                 [isCurrentPackage]="false"
//             >
//             </ui-grouped-offer-card-form-field>
//             <button class="submit" type="submit">
//                 SUBMIT
//             </button>
//         </form>
//     `,
//     props: {
//         isRTC: false,
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false),
//         parentOffer: parentOffer,
//         packageOptions: packageOptions,
//         packageDescription: choicePackageDescription,
//         choiceForm: new FormGroup({ choice: new FormControl() }),
//         submitChoiceForm: action('submitChoiceForm'),
//         flagPresent: false,
//         headlinePresent: false,
//         isCurrentPackage: false
//     }
// }));
