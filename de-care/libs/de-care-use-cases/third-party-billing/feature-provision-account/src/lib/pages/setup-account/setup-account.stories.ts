// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { TranslateModule } from '@ngx-translate/core';
// import { withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
// import { SetupAccountComponent } from './setup-account.component';
// import { DeCareUseCasesThirdPartyBillingFeatureProvisionAccountModule } from '../../de-care-use-cases-third-party-billing-feature-provision-account.module';
// import { of } from 'rxjs';
// import { ProvisionAccountActivateWorkflowService } from '@de-care/de-care-use-cases/third-party-billing/state-provision-account';
// import { DataValidationService } from '@de-care/data-services';
// const stories = storiesOf('de-care-use-cases/third-party-billing/setup-account-success', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), DeCareUseCasesThirdPartyBillingFeatureProvisionAccountModule],
//             providers: [
//                 {
//                     provide: DataValidationService,
//                     useValue: {
//                         validateCustomerInfo: () => of({ valid: true }),
//                         validatePassword: () => of({ valid: true })
//                     }
//                 },
//                 {
//                     provide: ProvisionAccountActivateWorkflowService,
//                     useValue: {
//                         build: () => of(true)
//                     }
//                 }
//             ]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withCommonDependencies);
//
// stories.add('Default', () => ({
//     component: SetupAccountComponent,
//     props: {
//         resellerName$: of('T-Mobile'),
//         resellerURL$: of('http://www.t-mobile.com')
//     }
// }));
