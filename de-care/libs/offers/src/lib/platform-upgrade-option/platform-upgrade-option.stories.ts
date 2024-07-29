// TODO: STORYBOOK_AUDIT

// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { OffersModule } from './../offers.module';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { PlanDetails, PlatformUpgradeOptionComponent } from './platform-upgrade-option.component';
// import { PlanTypeEnum } from '@de-care/data-services';
// import { action } from '@storybook/addon-actions';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { SettingsService } from '@de-care/settings';
//
// const stories = storiesOf('offers/platform-upgrade-option', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [OffersModule]
//         })
//     )
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// const planDetails = {
//     type: PlanTypeEnum.Trial,
//     packageName: 'SXM_SIR_AUD_ALLACCESS',
//     termLength: 6,
//     pricePerMonth: 8.33,
//     price: 50,
//     retailPrice: 21.99
// } as PlanDetails;
//
// stories.add('default', () => ({
//     component: PlatformUpgradeOptionComponent,
//     props: {
//         buyNow: action('@Output() buyNow emitted'),
//         keepSelect: action('@Output() keepSelect emitted'),
//         planDetails: planDetails
//     },
//     translation: { enabled: false }
// }));
//
// stories.add('in modal', () => ({
//     template: `
//         <sxm-ui-modal [closed]="false" title="All Access Plan details" [titlePresent]="true" [showBackButton]="true">
//             <app-platform-upgrade-option
//                 [planDetails]="planDetails"
//                 (buyNow)="buyNow()"
//                 (keepSelect)="keepSelect()">
//             </app-platform-upgrade-option>
//         </sxm-ui-modal>
//     `,
//     props: {
//         buyNow: action('@Output() buyNow emitted'),
//         keepSelect: action('@Output() keepSelect emitted'),
//         planDetails: planDetails
//     },
//     translation: { enabled: false }
// }));
//
// stories.add('in modal: in Canada', () => ({
//     moduleMetadata: {
//         imports: [SxmUiModule],
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true } }]
//     },
//     template: `
//         <sxm-ui-modal [closed]="false" title="All Access Plan details" [titlePresent]="true" [showBackButton]="true">
//             <app-platform-upgrade-option
//                 [planDetails]="planDetails"
//                 (buyNow)="buyNow()"
//                 (keepSelect)="keepSelect()">
//             </app-platform-upgrade-option>
//         </sxm-ui-modal>
//     `,
//     props: {
//         buyNow: action('@Output() buyNow emitted'),
//         keepSelect: action('@Output() keepSelect emitted'),
//         planDetails: planDetails
//     }
// }));
