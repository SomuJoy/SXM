// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS_CA } from '@de-care/shared/storybook/util-helpers';
// import { action } from '@storybook/addon-actions';
// import { VerifyAccountByLpzWorkflowService } from '@de-care/domains/account/state-account';
// import { of, throwError } from 'rxjs';
// import { SettingsService } from '@de-care/settings';
// import { DomainsIdentificationUiValidateLpzFormModule } from '../domains-identification-ui-validate-lpz-form.module';
//
// const stories = storiesOf('domains/identification/ValidateLpzFormComponent', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsIdentificationUiValidateLpzFormModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER]
//         })
//     );
//
// stories.add('default', () => ({
//     template: `
//         <identification-validate-lpz-form (lpzValidated)="lpzValidated()"></identification-validate-lpz-form>
//     `,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: VerifyAccountByLpzWorkflowService,
//                 useValue: { build: () => of(true) }
//             }
//         ]
//     },
//     props: {
//         lpzValidated: action(`LPZ validated`)
//     }
// }));
//
// stories.add('in Canada', () => ({
//     template: `
//         <identification-validate-lpz-form (lpzValidated)="lpzValidated()" [isCanada]="true"></identification-validate-lpz-form>
//     `,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: VerifyAccountByLpzWorkflowService,
//                 useValue: { build: () => of(true) }
//             },
//             ...TRANSLATE_PROVIDERS_CA,
//             { provide: SettingsService, useValue: { isCanadaMode: true } }
//         ]
//     },
//     props: {
//         lpzValidated: action(`LPZ validated`)
//     }
// }));
//
// stories.add('with invalid result', () => ({
//     template: `
//         <identification-validate-lpz-form (lpzValidated)="lpzValidated()"></identification-validate-lpz-form>
//     `,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: VerifyAccountByLpzWorkflowService,
//                 useValue: { build: () => throwError({ error: { error: { fieldErrors: [{ errorType: 'BUSINESS' }] } } }) }
//             }
//         ]
//     },
//     props: {
//         lpzValidated: action(`LPZ validated`)
//     }
// }));
//
// stories.add('with system error', () => ({
//     template: `
//         <identification-validate-lpz-form (lpzValidated)="lpzValidated()"></identification-validate-lpz-form>
//     `,
//     moduleMetadata: {
//         providers: [
//             {
//                 provide: VerifyAccountByLpzWorkflowService,
//                 useValue: { build: () => throwError({ error: { error: { fieldErrors: [{ errorType: 'SYSTEM' }] } } }) }
//             }
//         ]
//     },
//     props: {
//         lpzValidated: action(`LPZ validated`)
//     }
// }));
