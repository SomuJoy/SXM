// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withMockSettings, withTranslation, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { OffersModule } from '../offers.module';
// import { PlanComparisonGridComponent, RetailPriceAndMrdEligibility } from './plan-comparison-grid.component';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// export const packageFeatures_first: { name: string; tooltipText?: string; count: string | null }[] = [
//     {
//         name: 'Ad-free music channels',
//         count: '5',
//         tooltipText: null
//     },
//     {
//         name: '24/7 news, talk and comedy',
//         count: '',
//         tooltipText: null
//     }
// ];
// export const packageFeatures_second: { name: string; tooltipText?: string; count: string | null }[] = [
//     {
//         name: 'Sports talk and analysis',
//         count: '',
//         tooltipText: null
//     },
//     {
//         name: 'SiriusXM video',
//         count: '',
//         tooltipText:
//             'SiriusXM video clips include exclusive live performances, in-studio sessions, groundbreaking interviews, breaking ' +
//             'stories, celebrity visits, and in-depth conversations. Available online and on the app.'
//     },
//     {
//         name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
//         count: '',
//         tooltipText: 'Play-by-play from your hometown crew, talk and analysis, and channels for every major sport, college, and fantasy.'
//     }
// ];
// export const packageFeatures_third: { name: string; tooltipText?: string; count: string | null }[] = [
//     {
//         name: 'NFL<sup>&reg;</sup> and NASCAR<sup>&reg;</sup> Play-by-play',
//         count: '',
//         tooltipText: 'Every game and race, plus 24/7 exclusive talk channels dedicated to NFL and NASCAR.'
//     },
//     {
//         name: 'Howard Stern channels and video',
//         count: '',
//         tooltipText:
//             'Home of the King of All Media, listen and watch the best celebrity interviews, behind-the-scenes antics & more. Includes' +
//             ' access to the exclusive Howard Stern video library. Video content only available online and on the app.'
//     },
//     {
//         name: 'New! Personalized Stations Powered by Pandora<sup>&reg;</sup>',
//         count: '',
//         tooltipText: `We've brought the power of Pandora inside the SiriusXM app so you can create your own personalized ad-free music
//             stations. Just start your station by selecting an artist or song you're listening to on the SiriusXM app. Available online
//             and on the app.`
//     },
//     {
//         name: 'Xtra channels for every mood and activity',
//         count: '',
//         tooltipText: 'Over 100 new channels for you to enjoy even more variety from every decade and music style you love. Available ' + 'online and on the app.'
//     }
// ];
// export const selectedPackageName: string = 'SXM_SIR_ALLACCESS_FF';
// export const leadOfferPackageName: string = 'SXM_SIR_ALLACCESS_FF';
// export const packageNames = ['SXM_SIR_AUD_PKG_MM', 'SXM_SIR_EVT', 'SXM_SIR_ALLACCESS_FF'];
// export const retailPrices: RetailPriceAndMrdEligibility[] = [
//     { pricePerMonth: 10.99, mrdEligible: false },
//     { pricePerMonth: 16.99, mrdEligible: true },
//     {
//         pricePerMonth: 21.99,
//         mrdEligible: true
//     }
// ];
// export const allPackageDescriptions: { name: string; packageName: string; features: any; channels: any[]; channelLineUpURL: string }[] = [
//     {
//         name: 'SiriusXM Mostly Music',
//         packageName: 'SXM_SIR_AUD_PKG_MM',
//         features: [...packageFeatures_first],
//         channelLineUpURL: 'https://www.siriusxm.com/mostlymusicsxmcg',
//         channels: [
//             {
//                 title: '<b>SiriusXM Mostly Music Includes:</b>',
//                 count: '85+',
//                 descriptions: [
//                     'Ad-free music',
//                     'Select news, talk and entertainment channels',
//                     'Joel Osteen Radio, BBC World',
//                     'Service News, NPR<sup>&reg;</sup>, Kids Place Live, and more'
//                 ],
//                 features: [
//                     {
//                         name: 'Ad-free music channels',
//                         count: '60+',
//                         tooltipText: null
//                     },
//                     {
//                         name: '24/7 news, talk, sport and comedy',
//                         count: null,
//                         tooltipText: null
//                     },
//                     {
//                         name: 'Change or cancel at any time',
//                         count: null,
//                         tooltipText: null
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         name: 'SiriusXM Select',
//         packageName: 'SXM_SIR_EVT',
//         features: [...packageFeatures_first, ...packageFeatures_second],
//         channelLineUpURL: 'https://www.siriusxm.com/selectsxmcg',
//         channels: [
//             {
//                 title: '<b>SiriusXM Select Includes:</b>',
//                 count: '325+',
//                 descriptions: [
//                     'Ad-free music, plus news, talk, & entertainment',
//                     'SiriusXM video',
//                     '100+ Xtra music channels',
//                     'MLB<sup>&reg;</sup>, NBA, NHL<sup>&reg;</sup> games, the PGA TOUR<sup>&reg;</sup>, college sports',
//                     '24/7 comedy channels'
//                 ],
//                 features: [
//                     {
//                         name: 'Ad-free music channels',
//                         count: '240+',
//                         tooltipText: null
//                     },
//                     {
//                         name: 'Listen outside the car',
//                         count: null,
//                         tooltipText: null
//                     },
//                     {
//                         name: 'SiriusXM video',
//                         count: null,
//                         tooltipText: 'Exclusive live performances, in-studio sessions, groundbreaking interviews, available online and on the app.'
//                     },
//                     {
//                         name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
//                         count: null,
//                         tooltipText: 'Play-by-play from your hometown crew, along with 24/7 exclusive MLB, NBA, NHL, and PGA channels. Plus dedicated Fantasy Sports channels.'
//                     },
//                     {
//                         name: '24/7 news, talk, sport and comedy',
//                         count: null,
//                         tooltipText: null
//                     },
//                     {
//                         name: 'Change or cancel at any time',
//                         count: null,
//                         tooltipText: null
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         name: 'SiriusXM All Access',
//         packageName: 'SXM_SIR_ALLACCESS_FF',
//         features: [...packageFeatures_first, ...packageFeatures_second, ...packageFeatures_third],
//         channelLineUpURL: 'https://www.siriusxm.com/allaccesssxmcg',
//         channels: [
//             {
//                 title: '<b>SiriusXM All Access Includes:</b>',
//                 count: '350+',
//                 descriptions: [
//                     'Personalized Stations Powered by Pandora',
//                     'Ad-free music, plus news, talk, & entertainment',
//                     'SiriusXM video including Howard Stern',
//                     '100+ Xtra music channels',
//                     'Howard Stern channels',
//                     'Every NFL, MLB<sup>&reg;</sup>, NBA game, & NASCAR<sup>&reg;</sup> race, NHL<sup>&reg;</sup> games, the PGA TOUR<sup>&reg;</sup>, college sports',
//                     '24/7 comedy channels'
//                 ],
//                 features: [
//                     {
//                         name: 'Ad-free music channels',
//                         count: '240+',
//                         tooltipText: null
//                     },
//                     {
//                         name: 'Listen outside the car',
//                         count: null,
//                         tooltipText: null
//                     },
//                     {
//                         name: 'SiriusXM video',
//                         count: null,
//                         tooltipText: 'Exclusive live performances, in-studio sessions, groundbreaking interviews, available online and on the app.'
//                     },
//                     {
//                         name: 'MLB<sup>&reg;</sup>, NBA<sup>&reg;</sup>, NHL<sup>&reg;</sup> and PGA<sup>&reg;</sup> Play-by-play',
//                         count: null,
//                         tooltipText: 'Play-by-play from your hometown crew, along with 24/7 exclusive MLB, NBA, NHL, and PGA channels. Plus dedicated Fantasy Sports channels.'
//                     },
//                     {
//                         name: 'Howard Stern channels and video',
//                         count: null,
//                         tooltipText: `Home of the King of All Media, listen and watch the best celebrity interviews, behind-the-scenes antics & more.
//                             Includes access to the exclusive Howard Stern video library. Video content only available online and on the app.`
//                     },
//                     {
//                         name: 'NFL<sup>&reg;</sup> and NASCAR<sup>&reg;</sup> Play-by-play',
//                         count: null,
//                         tooltipText: 'Every game and race, plus 24/7 exclusive talk channels dedicated to NFL and NASCAR.'
//                     },
//                     {
//                         name: 'Pandora Stations',
//                         count: null,
//                         tooltipText: null
//                     },
//                     {
//                         name: '24/7 news, talk, sport and comedy',
//                         count: null,
//                         tooltipText: null
//                     },
//                     {
//                         name: 'Change or cancel at any time',
//                         count: null,
//                         tooltipText: null
//                     }
//                 ]
//             }
//         ]
//     }
// ];
// export const trialEndDate: string = '2020-06-25';
// export const packages: { packageName: string; pricePerMonth: number }[] = [
//     {
//         packageName: 'SXM_SIR_AUD_PKG_MM',
//         pricePerMonth: 10.99
//     },
//     {
//         packageName: 'SXM_SIR_EVT',
//         pricePerMonth: 16.99
//     },
//     {
//         packageName: 'SXM_SIR_ALLACCESS_FF',
//         pricePerMonth: 21.99
//     }
// ];
//
// export const leadOfferTerm = 3;
//
// const stories = storiesOf('offers/plan-comparison-grid', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         return of([
//                             {
//                                 name: 'SiriusXM Mostly Music',
//                                 packageName: 'SXM_SIR_AUD_PKG_MM',
//                                 channels: [
//                                     {
//                                         count: '50+',
//                                         features: [...packageFeatures_first]
//                                     }
//                                 ]
//                             },
//                             {
//                                 name: 'SiriusXM Select',
//                                 packageName: 'SXM_SIR_EVT',
//                                 channels: [
//                                     {
//                                         count: '100+',
//                                         features: [...packageFeatures_first, ...packageFeatures_second]
//                                     }
//                                 ]
//                             },
//                             {
//                                 name: 'SXM_SIR_ALLACCESS_FF',
//                                 packageName: 'SXM_SIR_ALLACCESS_FF',
//                                 channels: [
//                                     {
//                                         count: '300+',
//                                         features: [...packageFeatures_first, ...packageFeatures_second, ...packageFeatures_third]
//                                     }
//                                 ]
//                             }
//                         ]);
//                     }
//                 }
//             }
//         ]
//     },
//     component: PlanComparisonGridComponent,
//     props: {
//         packageNames: ['SXM_SIR_AUD_PKG_MM', 'SXM_SIR_EVT', 'SXM_SIR_ALLACCESS_FF'],
//         planSelectionData: {
//             trialEndDate,
//             familyDiscount: 5,
//             packages,
//             selectedPackageName,
//             leadOfferPackageName
//         },
//         retailPrices
//     }
// }));
