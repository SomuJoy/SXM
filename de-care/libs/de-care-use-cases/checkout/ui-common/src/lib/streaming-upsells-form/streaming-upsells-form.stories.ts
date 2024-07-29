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
// import { PackageStreamingCardFormFieldContent, PackageTermCardFormFieldContent, StreamingUpsellCopy, UpsellPlanCodeOptions } from './streaming-upsells-form.component';
//
// const stories = storiesOf('de care use cases/checkout/streaming plan upsells form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesCheckoutUiCommonModule, TranslateModule.forRoot(), BrowserAnimationsModule],
//             providers: [TRANSLATE_PROVIDERS],
//         })
//     );
//
// const packageUpsellCopyContent: PackageStreamingCardFormFieldContent = {
//     title: 'Upgrade to SiriusXM Premier Streaming',
//     copy: 'Upgrade to Premier Streaming for an additional $5.00 per month',
//     highlights: ['300+ channels on your phone, at home, and online', 'Ad-free music channels', 'NFL, NBA, NHL® and NCAA® play-by-play and talk'],
// };
// const packageUpsellTermSelectedCopyContent: PackageStreamingCardFormFieldContent = {
//     title: 'Upgrade to SiriusXM Premier Streaming',
//     copy: 'Upgrade to Premier Streaming for an additional $2.00 per month',
//     highlights: ['300+ channels on your phone, at home, and online', 'Ad-free music channels', 'NFL, NBA, NHL® and NCAA® play-by-play and talk'],
// };
// const termUpsellCopyContent: PackageTermCardFormFieldContent = {
//     title: 'Start with 12 Months and Save',
//     copy: '<p>Add 6 more months for an additional $3.00 per month</p>',
// };
// const termUpsellPackageSelectedCopyContent: PackageTermCardFormFieldContent = {
//     title: 'Start with 12 Months and Save',
//     copy: '<p>Add 6 more months for an additional $1.00 per month</p>',
// };
//
// stories.add('with package upsell only', () => ({
//     template: `
//         <de-care-streaming-upsells-form
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-streaming-upsells-form>
//     `,
//     props: {
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             packageUpsellPlanCode: 'package-upsell-offer',
//         },
//         upsellCopy: <StreamingUpsellCopy>{
//             packageCopyContent: packageUpsellCopyContent,
//         },
//         onPlanCodeSelected: action('@Output() planCodeSelected'),
//     },
// }));
//
// stories.add('with term upsell only', () => ({
//     template: `
//         <de-care-streaming-upsells-form
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-streaming-upsells-form>
//     `,
//     props: {
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             termUpsellPlanCode: 'term-upsell-offer',
//         },
//         upsellCopy: <StreamingUpsellCopy>{
//             termCopyContent: termUpsellCopyContent,
//         },
//         onPlanCodeSelected: action('@Output() planCodeSelected'),
//     },
// }));
//
// stories.add('with package and term', () => ({
//     template: `
//         <de-care-streaming-upsells-form
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-streaming-upsells-form>
//     `,
//     props: {
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             packageUpsellPlanCode: 'package-upsell-offer',
//             termUpsellPlanCode: 'term-upsell-offer',
//             packageAndTermUpsellPlanCode: 'package-and-term-upsell-offer',
//         },
//         upsellCopy: <StreamingUpsellCopy>{
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
//         <de-care-streaming-upsells-form
//             [submissionProcessing]="submissionProcessing$ | async"
//             [upsellPlanCodeOptions]="upsellPlanCodeOptions"
//             [upsellCopy]="upsellCopy"
//             (planCodeSelected)="onPlanCodeSelected($event)"
//         ></de-care-streaming-upsells-form>
//     `,
//     props: {
//         submissionProcessing$: submissionProcessing$,
//         upsellPlanCodeOptions: <UpsellPlanCodeOptions>{
//             packageUpsellPlanCode: 'package-upsell-offer',
//         },
//         upsellCopy: <StreamingUpsellCopy>{
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
