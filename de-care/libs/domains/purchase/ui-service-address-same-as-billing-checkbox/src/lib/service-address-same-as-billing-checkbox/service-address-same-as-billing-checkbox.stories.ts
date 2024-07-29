// TODO: STORYBOOK_AUDIT

// import { action } from '@storybook/addon-actions';
// import { withKnobs } from '@storybook/addon-knobs';
// import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
// import { ServiceAddressSameAsBillingCheckboxComponent } from './service-address-same-as-billing-checkbox.component';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule } from '../domains-purchase-ui-service-address-same-as-billing-checkbox.module';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SettingsService } from '@de-care/settings';
//
// const stories = storiesOf('domains/purchase/service-address-same-as-billing-checkbox', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     template: `
//         <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
//             <service-address-same-as-billing-checkbox
//                 formControlName="serviceAddressSameAsBilling">
//             </service-address-same-as-billing-checkbox>
//             <button type="submit">Submit</button>
//         </form>
//     `,
//     component: ServiceAddressSameAsBillingCheckboxComponent,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({ serviceAddressSameAsBilling: new FormControl(true) }),
//         onSubmit: action('onSubmit')
//     }
// }));
//
// stories.add('in Canada', () => ({
//     template: `
//         <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
//             <service-address-same-as-billing-checkbox
//                 formControlName="serviceAddressSameAsBillingCanada">
//             </service-address-same-as-billing-checkbox>
//             <button type="submit">Submit</button>
//         </form>
//     `,
//     component: ServiceAddressSameAsBillingCheckboxComponent,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true
//                 }
//             }
//         ]
//     },
//     props: {
//         form: new FormGroup({ serviceAddressSameAsBillingCanada: new FormControl(true) }),
//         onSubmit: action('onSubmit')
//     }
// }));
