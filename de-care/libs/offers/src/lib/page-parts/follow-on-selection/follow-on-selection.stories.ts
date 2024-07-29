// TODO: STORYBOOK_AUDIT

// import { UserSettingsService } from '@de-care/settings';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withMockSettings, withTranslation, MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { OffersModule } from '../../offers.module';
// import { PlanComparisonGridParams } from '../../plan-comparison-grid/plan-comparison-grid.component';
// import { FollowOnSelectionComponent, FollowOnPlanSelectionData } from './follow-on-selection.component';
// import { DataOfferService } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import {
//     packageNames,
//     retailPrices,
//     selectedPackageName,
//     leadOfferPackageName,
//     allPackageDescriptions,
//     packages,
//     trialEndDate,
//     leadOfferTerm
// } from '../../plan-comparison-grid/plan-comparison-grid.stories';
// import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
//
// const leadOfferEndDate: string = '2/27/2050';
//
// const stories = storiesOf('offers/follow-on-selection', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, { provide: UserSettingsService, useClass: UserSettingsService }]
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
//                     allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
//                 },
//                 packageNames
//             }
//         ]
//     },
//     component: FollowOnSelectionComponent,
//     props: {
//         planSelectionData: {
//             leadOfferEndDate,
//             packages,
//             selectedPackageName,
//             leadOfferPackageName
//         } as FollowOnPlanSelectionData,
//         packageNames
//     }
// }));
//
// stories.add('w/ grid', () => ({
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
//                 },
//                 packageNames
//             }
//         ]
//     },
//     template: `
//         <follow-on-selection [planSelectionData]="planSelectionData"></follow-on-selection>
//         <plan-comparison-grid [packageNames]="packageNames" [retailPrices]="retailPrices" [planComparisonGridParams]="planSelectionData"></plan-comparison-grid>
//     `,
//     props: {
//         planSelectionData: {
//             selectedPackageName,
//             leadOfferPackageName,
//             leadOfferTerm,
//             trialEndDate,
//             packages
//         } as PlanComparisonGridParams,
//         packageNames,
//         retailPrices
//     }
// }));
//
// stories.add('w/ grid, modal, and sticky row', () => ({
//     moduleMetadata: {
//         imports: [SxmUiModule],
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
//                 },
//                 packageNames
//             }
//         ]
//     },
//     template: `
//         <sxm-ui-modal class="modal--full-view modal--content-grid" [closed]="false" title="Subscription Options" [titlePresent]="true">
//             <follow-on-selection class="stick-to-top" [planSelectionData]="planSelectionData"></follow-on-selection>
//             <plan-comparison-grid [packageNames]="packageNames" [retailPrices]="retailPrices" [planComparisonGridParams]="planSelectionData"></plan-comparison-grid>
//         </sxm-ui-modal>
//     `,
//     props: {
//         planSelectionData: {
//             selectedPackageName,
//             leadOfferPackageName,
//             leadOfferTerm,
//             trialEndDate,
//             packages
//         } as PlanComparisonGridParams,
//         packageNames,
//         retailPrices
//     }
// }));
//
// stories.add('w/ grid, on page, w/o sticky row ', () => ({
//     moduleMetadata: {
//         imports: [SxmUiModule],
//         providers: [
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: ({ locale }) => of(allPackageDescriptions)
//                 },
//                 packageNames,
//                 retailPrices
//             }
//         ]
//     },
//     template: `
//     <div class="background-black">
//         <div class="content-container">
//             <div class="row align-center no-padding-small">
//                 <div class="column small-12 medium-8 no-padding-medium">
//                     <div class="flex align-middle" style="width: 100%; min-height: 45px;">
//                         <img style="height: 26px; max-width: 135px;"alt="SiriusXM" class="sxm-nav-logo" src="assets/img/sxm-logo-white.png">
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     <hero-component [showImage]="false" [heroTitleType]="heroTitleType" termLength="3" packageName="All Access" price="2" [alignLeftMediumUp]="true"></hero-component>
//     <div class="content-container">
//         <div class="row align-center">
//            <div class="column small-12 medium-8 no-padding-small background-white" style="margin: 15px 0;">
//                 <follow-on-selection [planSelectionData]="planSelectionData"></follow-on-selection>
//                 <plan-comparison-grid [packageNames]="packageNames" [retailPrices]="retailPrices" [planComparisonGridParams]="planSelectionData"></plan-comparison-grid>
//             </div>
//         </div>
//     </div>
//      <div class="background-offwhite">
//         <div class="content-container">
//             <div class="row align-center no-padding-small">
//                 <div class="column small-12 medium-8 no-padding-medium">
//                     <div class="flex align-middle" style="width: 100%; min-height: 45px;">
//                         <important-info></important-info>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `,
//     props: {
//         planSelectionData: {
//             selectedPackageName,
//             leadOfferPackageName,
//             leadOfferTerm,
//             trialEndDate,
//             packages
//         } as PlanComparisonGridParams,
//         packageNames,
//         retailPrices,
//         heroTitleType: HeroTitleTypeEnum.Renewal
//     }
// }));
