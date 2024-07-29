// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { action } from '@storybook/addon-actions';
// import { DomainsIdentificationUiRadioIdAndLastnameLookupFormModule } from '../domains-identification-ui-radio-id-and-lastname-lookup-form.module';
//
// const stories = storiesOf('domains/identification/RadioIdAndAccountNumberLookupForm', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsIdentificationUiRadioIdAndLastnameLookupFormModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
//         })
//     );
//
// stories.add('default', () => ({
//     template: `
//         <radio-id-and-lastname-lookup-form
//             #component
//             (radioIdAndLastnameReadyToProcess)="process($event, component)"
//         ></radio-id-and-lastname-lookup-form>
//     `,
//     props: {
//         process: (data, component) => {
//             action(`Form data collected`)(data);
//             component.completedLookupSuccess();
//         },
//     },
// }));
//
// stories.add('with lookup error', () => ({
//     template: `
//         <radio-id-and-lastname-lookup-form
//             #component
//             (radioIdAndLastnameReadyToProcess)="process($event, component)"
//         ></radio-id-and-lastname-lookup-form>
//     `,
//     props: {
//         process: (data, component) => {
//             action(`Form data collected`)(data);
//             component.completedLookupFail();
//         },
//     },
// }));
//
// stories.add('with lookup error (and custom error message)', () => ({
//     template: `
//         <radio-id-and-lastname-lookup-form
//             #component
//             (radioIdAndLastnameReadyToProcess)="process($event, component)"
//             [lookupErrorTextCopy]="errorText"
//         ></radio-id-and-lastname-lookup-form>
//     `,
//     props: {
//         errorText: 'Custom lookup error message here.',
//         process: (data, component) => {
//             action(`Form data collected`)(data);
//             component.completedLookupFail();
//         },
//     },
// }));
//
// stories.add('with system error', () => ({
//     template: `
//         <radio-id-and-lastname-lookup-form
//             #component
//             (radioIdAndLastnameReadyToProcess)="process($event, component)"
//         ></radio-id-and-lastname-lookup-form>
//     `,
//     props: {
//         process: (data, component) => {
//             action(`Form data collected`)(data);
//             component.showSystemError();
//         },
//     },
// }));