// TODO: STORYBOOK_AUDIT

// import { action } from '@storybook/addon-actions';
// import { SettingsService } from '@de-care/settings';
// import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
// import { withCommonDependencies, TRANSLATE_PROVIDERS, MOCK_BIN_RANGES_TOKEN_PROVIDER, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DomainsPurchaseUiCreditCardFormFieldsModule } from '../domains-purchase-ui-credit-card-form-fields.module';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
//
// const stories = storiesOf('domains/purchase/purchase-ui-credit-card-form-fields', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsPurchaseUiCreditCardFormFieldsModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_BIN_RANGES_TOKEN_PROVIDER]
//         })
//     )
//     .addDecorator(withKnobs)
//     .addDecorator(withMockSettings)
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         submitted: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('in Canada', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 labelText="hello"
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule],
//         providers: [
//             {
//                 provide: SettingsService,
//                 useValue: {
//                     isCanadaMode: true,
//                     settings: { country: 'ca' }
//                 }
//             }
//         ]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         submitted: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with service error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: false,
//         serviceError: true,
//         submitted: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with cc error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: true,
//         serviceError: false,
//         submitted: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with service error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//                 [ccNameError]="ccNameError"
//                 [ccNumError]="ccNumError"
//                 [ccNumFoundError]="ccNumFoundError"
//                 [ccExpInvalidError]="ccExpInvalidError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: false,
//         serviceError: true,
//         submitted: false,
//         ccNameError: false,
//         ccNumError: false,
//         ccNumFoundError: false,
//         ccExpInvalidError: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with name error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//                 [ccNameError]="ccNameError"
//                 [ccNumError]="ccNumError"
//                 [ccNumFoundError]="ccNumFoundError"
//                 [ccExpInvalidError]="ccExpInvalidError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: false,
//         serviceError: false,
//         submitted: false,
//         ccNameError: true,
//         ccNumError: false,
//         ccNumFoundError: false,
//         ccExpInvalidError: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with number error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//                 [ccNameError]="ccNameError"
//                 [ccNumError]="ccNumError"
//                 [ccNumFoundError]="ccNumFoundError"
//                 [ccExpInvalidError]="ccExpInvalidError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: false,
//         serviceError: false,
//         submitted: false,
//         ccNameError: false,
//         ccNumError: true,
//         ccNumFoundError: false,
//         ccExpInvalidError: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with number found error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//                 [ccNameError]="ccNameError"
//                 [ccNumError]="ccNumError"
//                 [ccNumFoundError]="ccNumFoundError"
//                 [ccExpInvalidError]="ccExpInvalidError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: false,
//         serviceError: false,
//         submitted: false,
//         ccNameError: false,
//         ccNumError: false,
//         ccNumFoundError: true,
//         ccExpInvalidError: false,
//         submitForm: action('submitForm()')
//     }
// }));
//
// stories.add('with expiration invalid error', () => ({
//     template: `
//         <form
//             [formGroup]="form"
//             (ngSubmit)="submitForm(form.value)"
//         >
//             <credit-card-form-fields
//                 formControlName="paymentInfo"
//                 [maskCreditCardNumber]="false"
//                 [submitted]="submitted"
//                 [ccError]="ccError"
//                 [serviceError]="serviceError"
//                 [ccNameError]="ccNameError"
//                 [ccNumError]="ccNumError"
//                 [ccNumFoundError]="ccNumFoundError"
//                 [ccExpInvalidError]="ccExpInvalidError"
//             ></credit-card-form-fields>
//             <button type="submit">SUBMIT</button>
//         </form>
//     `,
//     moduleMetadata: {
//         imports: [ReactiveFormsModule]
//     },
//     props: {
//         form: new FormGroup({
//             paymentInfo: new FormControl()
//         }),
//         ccError: false,
//         serviceError: false,
//         submitted: false,
//         ccNameError: false,
//         ccNumError: false,
//         ccNumFoundError: false,
//         ccExpInvalidError: true,
//         submitForm: action('submitForm()')
//     }
// }));
