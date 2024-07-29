// TODO: STORYBOOK_AUDIT

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { TranslateModule } from '@ngx-translate/core';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { BehaviorSubject, timer } from 'rxjs';
// import { DeCareUseCasesCheckoutUiCommonModule } from '../de-care-use-cases-checkout-ui-common.module';
// import { PackageSatelliteCardFormFieldContent, PackageTermCardFormFieldContent, SatelliteUpsellCopy, UpsellPlanCodeOptions } from './satellite-upsells-form.component';
//
// const stories = storiesOf('de care use cases/checkout/satellite plan upsells form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesCheckoutUiCommonModule, TranslateModule.forRoot(), BrowserAnimationsModule],
//             providers: [TRANSLATE_PROVIDERS],
//         })
//     );
//
// const packageUpsellCopyContent: PackageSatelliteCardFormFieldContent = {
//     marketingCallout: 'OUR BEST PLAN',
//     title: 'Upgrade to XM All Access',
//     copy: 'Add premium channels plus streaming for an additional $3.34 per month',
//     icons: {
//         inside: {
//             isActive: true,
//             label: 'Inside the car',
//         },
//         outside: {
//             isActive: true,
//             label: 'Outside the car',
//         },
//         pandora: {
//             isActive: false,
//             label: null,
//         },
//         perks: {
//             isActive: false,
//             label: null,
//         },
//     },
// };
// const packageUpsellTermSelectedCopyContent: PackageSatelliteCardFormFieldContent = {
//     marketingCallout: 'OUR BEST PLAN',
//     title: 'Upgrade to XM All Access',
//     copy: 'Add premium channels plus streaming for an additional $1.74 per month',
//     icons: {
//         inside: {
//             isActive: true,
//             label: 'Inside the car',
//         },
//         outside: {
//             isActive: true,
//             label: 'Outside the car',
//         },
//         pandora: {
//             isActive: false,
//             label: null,
//         },
//         perks: {
//             isActive: false,
//             label: null,
//         },
//     },
// };
// const termUpsellCopyContent: PackageTermCardFormFieldContent = {
//     title: 'Start with 12 Months and Save',
//     copy: "<p>Add 6 more months for an additional $3.26 per month</p><strong>Get 12 months of XM Select for $8.25 per month. You'll save $32.88</strong><p>Compared to the 6-month deal after 12 months. Based on regular $16.99/mo rate. Fees and taxes apply. See offer details.</p>",
// };
// const termUpsellPackageSelectedCopyContent: PackageTermCardFormFieldContent = {
//     title: 'Start with 12 Months and Save',
//     copy: "<p>Add 6 more months for an additional $1.66 per month</p><strong>Get 12 months of XM All Access for $9.99 per month. You'll save $62.04</strong><p>Compared to the 6-month deal after 12 months. Based on regular $21.99/mo rate. Fees and taxes apply. See offer details.</p>",
// };
//
// stories.add('with package upsell only', () => ({
//     template: `
//         <de-care-satellite-upsells-form
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-satellite-upsells-form>
//     `,
//     props: {
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             packageUpsellPlanCode: 'package-upsell-offer',
//         },
//         upsellCopy: <SatelliteUpsellCopy>{
//             packageCopyContent: packageUpsellCopyContent,
//         },
//         onPlanCodeSelected: action('@Output() planCodeSelected'),
//     },
// }));
//
// stories.add('with term upsell only', () => ({
//     template: `
//         <de-care-satellite-upsells-form
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-satellite-upsells-form>
//     `,
//     props: {
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             termUpsellPlanCode: 'term-upsell-offer',
//         },
//         upsellCopy: <SatelliteUpsellCopy>{
//             termCopyContent: termUpsellCopyContent,
//         },
//         onPlanCodeSelected: action('@Output() planCodeSelected'),
//     },
// }));
//
// stories.add('with package and term', () => ({
//     template: `
//         <de-care-satellite-upsells-form
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-satellite-upsells-form>
//     `,
//     props: {
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             packageUpsellPlanCode: 'package-upsell-offer',
//             termUpsellPlanCode: 'term-upsell-offer',
//             packageAndTermUpsellPlanCode: 'package-and-term-upsell-offer',
//         },
//         upsellCopy: <SatelliteUpsellCopy>{
//             packageCopyContent: packageUpsellCopyContent,
//             packageCopyContentWhenTermSelected: packageUpsellTermSelectedCopyContent,
//             termCopyContent: termUpsellCopyContent,
//             termCopyContentWhenPackageSelected: termUpsellPackageSelectedCopyContent,
//         },
//         onPlanCodeSelected: action('@Output() planCodeSelected'),
//     },
// }));
//
// const submissionProcessing$ = new BehaviorSubject(false);
// stories.add('with submission processing', () => ({
//     template: `
//         <de-care-satellite-upsells-form
//             [submissionProcessing]="submissionProcessing$ | async"
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-satellite-upsells-form>
//     `,
//     props: {
//         submissionProcessing$: submissionProcessing$,
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             packageUpsellPlanCode: 'package-upsell-offer',
//         },
//         upsellCopy: <SatelliteUpsellCopy>{
//             packageCopyContent: packageUpsellCopyContent,
//         },
//         onPlanCodeSelected: (planCode) => {
//             submissionProcessing$.next(true);
//             timer(2000).subscribe(() => {
//                 submissionProcessing$.next(false);
//                 action('@Output() planCodeSelected')(planCode);
//             });
//         },
//     },
// }));
