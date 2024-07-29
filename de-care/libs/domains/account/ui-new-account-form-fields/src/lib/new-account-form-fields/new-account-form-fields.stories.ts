// TODO: STORYBOOK_AUDIT

// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { DomainsAccountUiNewAccountFormFieldsModule } from '../domains-account-ui-new-account-form-fields.module';
// import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DataValidationService } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { action } from '@storybook/addon-actions';
//
// const stories = storiesOf('domains/account/new-account-form-fields', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsAccountUiNewAccountFormFieldsModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('No Prospect data', () => ({
//     template: `
//         <form [formGroup]="formGroup" (ngSubmit)="submitted = true; onSubmit(form)" #form="ngForm">
//             <new-account-form-fields
//                 [parentFormGroup]="formGroup"
//                 [submitted]="submitted"
//                 [canEditUsername]="true"></new-account-form-fields>
//             <button type="submit">Submit</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [
//             {
//                 provide: DataValidationService,
//                 useValue: { validateCustomerInfo: () => of({ valid: true }), validatePassword: () => of({ valid: true }) }
//             }
//         ]
//     },
//     props: {
//         formGroup: new FormGroup({}),
//         submitted: false,
//         onSubmit: action('Form submitted')
//     }
// }));
//
// stories.add('With Prospect data', () => ({
//     template: `
//         <form [formGroup]="formGroup" (ngSubmit)="submitted = true; onSubmit(form)" #form="ngForm">
//             <new-account-form-fields
//                 [parentFormGroup]="formGroup"
//                 [submitted]="submitted"
//                 [prospectData]="prospectData"></new-account-form-fields>
//             <button type="submit">Submit</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [
//             {
//                 provide: DataValidationService,
//                 useValue: { validateCustomerInfo: () => of({ valid: true }), validatePassword: () => of({ valid: true }) }
//             }
//         ]
//     },
//     props: {
//         formGroup: new FormGroup({}),
//         prospectData: {
//             firstName: 'Nando',
//             lastName: 'Man',
//             username: 'nandoman@siriusxm.com',
//             trialstartdate: '01/03/2020',
//             trialenddate: '12/24/2020',
//             promocode: 'AA3MOTRIALGGLE',
//             addressLine1: '1 River Rd',
//             city: 'Schenectady',
//             state: 'NY',
//             postalCode: '12345'
//         },
//         submitted: false,
//         onSubmit: action('Form submitted')
//     }
// }));
