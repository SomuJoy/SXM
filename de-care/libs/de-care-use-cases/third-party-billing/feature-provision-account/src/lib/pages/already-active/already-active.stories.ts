// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { TranslateModule } from '@ngx-translate/core';
// import { withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
// import { DeCareUseCasesThirdPartyBillingFeatureProvisionAccountModule } from '../../de-care-use-cases-third-party-billing-feature-provision-account.module';
// import { AlreadyActiveComponent } from './already-active.component';
// import { of } from 'rxjs';
// const stories = storiesOf('de-care-use-cases/third-party-billing/already-active', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), DeCareUseCasesThirdPartyBillingFeatureProvisionAccountModule],
//             providers: []
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withCommonDependencies);
//
// stories.add('Default', () => ({
//     component: AlreadyActiveComponent,
//     props: {
//         resellerName$: of('T-Mobile'),
//         resellerURL$: of('http://www.t-mobile.com')
//     }
// }));
