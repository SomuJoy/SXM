// TODO: STORYBOOK_AUDIT

// import { object, withKnobs, boolean } from '@storybook/addon-knobs';
//
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { OffersModule } from '@de-care/offers';
// import { SettingsService } from '@de-care/settings';
// import { TRANSLATE_PROVIDERS, withTranslation, withMockSettings } from '@de-care/shared/storybook/util-helpers';
// import { Channel } from '@de-care/domains/offers/ui-plan-description-channels';
// import { of } from 'rxjs';
// import { DataOfferService } from '@de-care/data-services';
// import { OfferDescriptionOemComponent, OfferInfo } from '@de-care/domains/offers/ui-offer-description';
//
// const mockPackageDescriptionsProvider = {
//     provide: DataOfferService,
//     useValue: {
//         allPackageDescriptions: ({ locale }) => {
//             if (locale === 'en_US') {
//                 return of([
//                     {
//                         name: 'SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS',
//                         description: '',
//                         promoFooter: 'Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//                         channels: [
//                             {
//                                 title: '<b>SiriusXM All Access Includes:</b>',
//                                 descriptions: [
//                                     '140+ Channels',
//                                     '85 ad-free music channels',
//                                     'Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//                                     'Listen in your car from coast to coast'
//                                 ]
//                             }
//                         ] as Channel[]
//                     }
//                 ]);
//             } else if (locale === 'fr_CA') {
//                 return of([
//                     {
//                         name: 'FR:: SiriusXM All Access',
//                         packageName: 'SXM_SIR_AUD_ALLACCESS',
//                         description: '',
//                         promoFooter: 'FR:: Listen & watch your favorites in all your favorite places—in your car, on your phone or at home',
//                         channels: [
//                             {
//                                 title: '<b>FR:: SiriusXM All Access Includes:</b>',
//                                 descriptions: [
//                                     'FR:: 140+ Channels',
//                                     'FR:: 85 ad-free music channels',
//                                     'FR:: Premium music channels like Garth Brooks, The Beatles, Pearl Jam, Bruce Springsteen, Grateful Dead, live performances & more',
//                                     'FR:: Listen in your car from coast to coast'
//                                 ]
//                             }
//                         ] as Channel[]
//                     }
//                 ]);
//             }
//         }
//     }
// };
//
// const stories = storiesOf('offers/offer-description-oem', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule],
//             providers: [...TRANSLATE_PROVIDERS, { provide: SettingsService, useValue: { isCanadaMode: false } }]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         providers: [mockPackageDescriptionsProvider]
//     },
//     component: OfferDescriptionOemComponent,
//     props: {
//         offerInfo: object('@Input() offerInfo', {
//             packageName: 'SXM_SIR_AUD_ALLACCESS',
//             termLength: 6,
//             pricePerMonth: 4.99,
//             retailPrice: 15.99,
//             price: 15.99
//         } as OfferInfo),
//         excludePriceAndTermDisplay: boolean('@Input() excludePriceAndTermDisplay', false)
//     }
// }));
