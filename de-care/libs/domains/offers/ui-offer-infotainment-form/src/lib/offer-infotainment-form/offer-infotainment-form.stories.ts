// TODO: STORYBOOK_AUDIT

// tslint:disable:max-line-length
// eslint:disable:max-line-length
// import { ReactiveFormsModule } from '@angular/forms';
// import { SettingsService } from '@de-care/settings';
// import { action } from '@storybook/addon-actions';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withCommonDependencies, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { withKnobs } from '@storybook/addon-knobs';
// import { DomainsOffersUiOfferInfotainmentFormModule } from '../domains-offers-ui-offer-infotainment-form.module';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// const samplePackages = [
//     {
//         offerInfo: {
//             packageName: 'SIR_DATA_TRVLLNK_TRAF',
//             pricePerMonth: 5.98,
//             type: 'SELF_PAID',
//             dataCapable: true
//         },
//         planCode: 'Travel-Link + Traffic - 1mo - wActv',
//         currentlyHave: false,
//         isBundlePlan: true,
//         bundleSavingsAmount: 5,
//         bundleSubPackageNames: ['SXM_SIR_DATA_TRAFF', 'SXM_SIR_DATA_TRVLLNK']
//     },
//     {
//         offerInfo: {
//             packageName: 'SXM_SIR_DATA_TRAFF',
//             pricePerMonth: 3.99,
//             type: 'SELF_PAID',
//             dataCapable: true
//         },
//         planCode: 'Traffic - 1mo - wActv',
//         currentlyHave: true,
//         isBundlePlan: false,
//         bundleSavingsAmount: 0
//     },
//     {
//         offerInfo: {
//             packageName: 'SXM_SIR_DATA_TRVLLNK',
//             pricePerMonth: 1.99,
//             type: 'SELF_PAID',
//             dataCapable: true
//         },
//         planCode: 'Travel-Link - 1mo - wActv',
//         currentlyHave: false,
//         isBundlePlan: false,
//         bundleSavingsAmount: 0
//     },
//     {
//         offerInfo: {
//             packageName: 'SXM_SIR_NAV_WEATHER',
//             pricePerMonth: 1.99,
//             type: 'SELF_PAID',
//             dataCapable: true
//         },
//         planCode: 'Nav-Weather - 1mo - wActv',
//         currentlyHave: false,
//         isBundlePlan: false,
//         bundleSavingsAmount: 0
//     }
// ];
//
// const stories = storiesOf('Domains/Offers/OfferInfotainmentForm', module)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsOffersUiOfferInfotainmentFormModule]
//         })
//     )
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('default', () => ({
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => {
//                         if (locale === 'fr_CA') {
//                             return of([
//                                 {
//                                     name: 'SiriusXM Nav Weather',
//                                     packageName: 'SXM_SIR_CAN_NAV_WEATHER',
//                                     description:
//                                         'De l’information utile là où vous en avez le plus besoin : au bout de vos doigts, dans votre véhicule. </br>Travel Link, qui regroupe des services conçus pour améliorer le temps que vous passez au volant, vous transmet de nombreux renseignements utiles directement sur le système de navigation compatible de votre véhicule. </br>Avec SiriusXM Traffic, vous avez accès à des données de circulation détaillées sur le système de navigation ou de divertissement de votre véhicule. Localisez les incidents de circulation majeurs, les accidents, les fermetures de route et plus encore. Information sur la circulation d’un océan à l’autre, diffusée 24 heures sur 24, 7 jours sur 7, par satellite.'
//                                 },
//                                 {
//                                     name: 'SiriusXM Traffic et SiriusXM Travel Link',
//                                     packageName: 'SIR_CAN_DATA_TRVLLNK_TRAF',
//                                     description:
//                                         'De l’information utile là où vous en avez le plus besoin : au bout de vos doigts, dans votre véhicule. </br>Travel Link, qui regroupe des services conçus pour améliorer le temps que vous passez au volant, vous transmet de nombreux renseignements utiles directement sur le système de navigation compatible de votre véhicule. </br>Avec SiriusXM Traffic, vous avez accès à des données de circulation détaillées sur le système de navigation ou de divertissement de votre véhicule. Localisez les incidents de circulation majeurs, les accidents, les fermetures de route et plus encore. Information sur la circulation d’un océan à l’autre, diffusée 24 heures sur 24, 7 jours sur 7, par satellite.'
//                                 },
//                                 {
//                                     name: 'SiriusXM Traffic Plus',
//                                     packageName: 'SXM_CAN_SIR_DATA_TRAFF_PLUS',
//                                     description:
//                                         'Ne vous précipitez pas dans la circulation. Contournez-la. SiriusXM Traffic fonctionne avec le système de navigation de votre véhicule pour afficher des précisions sur la circulation. Repérez les incidents, les accidents, les fermetures de routes, et plus encore.'
//                                 },
//                                 {
//                                     name: 'SiriusXM Travel Link',
//                                     packageName: 'SXM_SIR_CAN_DATA_TRVLLNK',
//                                     description:
//                                         'De l’information utile là où vous en avez le plus besoin : au bout de vos doigts, dans votre véhicule. </br>Travel Link, qui regroupe des services conçus pour améliorer le temps que vous passez au volant, vous transmet de nombreux renseignements utiles directement sur le système de navigation compatible de votre véhicule. </br>Avec SiriusXM Traffic, vous avez accès à des données de circulation détaillées sur le système de navigation ou de divertissement de votre véhicule. Localisez les incidents de circulation majeurs, les accidents, les fermetures de route et plus encore. Information sur la circulation d’un océan à l’autre, diffusée 24 heures sur 24, 7 jours sur 7, par satellite.'
//                                 }
//                             ]);
//                         } else {
//                             return of([
//                                 {
//                                     name: 'SiriusXM Nav Weather',
//                                     packageName: 'SXM_SIR_NAV_WEATHER',
//                                     description:
//                                         'Everything you need to know while you’re on the road. SiriusXM Travel Link bring infotainment services to your vehicle’s navigation system. Includes one or more of these services depending on device Weather, Fuel Prices, Movie Listings and Sports info*. <br><br>*Some Travel Link services are not available in certain vehicles. Check your owner’s guide. Other fees and taxes may apply.'
//                                 },
//                                 {
//                                     name: 'SiriusXM Traffic + SiriusXM Travel Link',
//                                     packageName: 'SIR_DATA_TRVLLNK_TRAF',
//                                     description:
//                                         'Everything you need to know while you’re on the road. SiriusXM Traffic and SiriusXM Travel Link bring infotainment services to your vehicle’s navigation system. Receive detailed information regarding traffic flow and traffic-related incidents. Includes one or more of these services depending on device Weather, Fuel Prices, Movie Listings and Sports info*. <br><br>*Some Travel Link services are not available in certain vehicles. Check your owner’s guide. Other fees and taxes may apply.'
//                                 },
//                                 {
//                                     name: 'SiriusXM Traffic',
//                                     packageName: 'SXM_SIR_DATA_TRAFF',
//                                     description:
//                                         'Don’t drive through traffic, drive around it. SiriusXM Traffic works with your vehicles navigation system to display continuously updated traffic information. Pinpoint traffic incidents, accidents, road closings and more.'
//                                 },
//                                 {
//                                     name: 'SiriusXM Travel Link',
//                                     packageName: 'SXM_SIR_DATA_TRVLLNK',
//                                     description:
//                                         'Everything you need to know while you’re on the road. SiriusXM Travel Link bring infotainment services to your vehicle’s navigation system. Includes one or more of these services depending on device Weather, Fuel Prices, Movie Listings and Sports info*. <br><br>*Some Travel Link services are not available in certain vehicles. Check your owner’s guide. Other fees and taxes may apply.'
//                                 }
//                             ]);
//                         }
//                     }
//                 }
//             }
//         ]
//     },
//     template: `
//             <offer-infotainment-form
//                 [infotainmentPlans]="infotainmentPlans"
//                 (selectedInfotainmentPlans)="selectedInfotainmentPlans($event)"
//             >
//             </offer-infotainment-form>
//         `,
//     props: {
//         infotainmentPlans: samplePackages,
//         selectedInfotainmentPlans: action('@Output() selectedInfotainmentPlans')
//     }
// }));
// //Remove Comment
