// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withTranslation, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { DomainsOffersUiPackageDescriptionsModule } from '../domains-offers-ui-package-descriptions.module';
// import { APP_INITIALIZER } from '@angular/core';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
//
// export function setPackageTranslations(translateService: TranslateService) {
//     return () => {
//         translateService.setTranslation(
//             'en-US',
//             {
//                 app: {
//                     packageDescriptions: {
//                         SIR_AUD_ALLACCESS: {
//                             name: 'All Access',
//                             packageOverride: [
//                                 {
//                                     name: 'All Access Advantage',
//                                     type: 'ADVANTAGE'
//                                 }
//                             ]
//                         }
//                     }
//                 }
//             },
//             true
//         );
//         translateService.setTranslation(
//             'fr-CA',
//             {
//                 app: {
//                     packageDescriptions: {
//                         SIR_AUD_ALLACCESS: {
//                             name: 'FR: All Access',
//                             packageOverride: [
//                                 {
//                                     name: 'FR: All Access Advantage',
//                                     type: 'ADVANTAGE'
//                                 }
//                             ]
//                         }
//                     }
//                 }
//             },
//             true
//         );
//     };
// }
//
// const stories = storiesOf('Domains/Offers/TranslateOfferNamesPipe', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), DomainsOffersUiPackageDescriptionsModule],
//             providers: [
//                 TRANSLATE_PROVIDERS,
//                 {
//                     provide: APP_INITIALIZER,
//                     useFactory: setPackageTranslations,
//                     deps: [TranslateService],
//                     multi: true
//                 }
//             ]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('with no override', () => ({
//     template: `{{ offer | translateOfferName }}`,
//     props: {
//         offer: {
//             packageName: 'SIR_AUD_ALLACCESS',
//             type: ''
//         }
//     }
// }));
//
// stories.add('with override', () => ({
//     template: `{{ offer | translateOfferName }}`,
//     props: {
//         offer: {
//             packageName: 'SIR_AUD_ALLACCESS',
//             type: 'ADVANTAGE'
//         }
//     }
// }));
