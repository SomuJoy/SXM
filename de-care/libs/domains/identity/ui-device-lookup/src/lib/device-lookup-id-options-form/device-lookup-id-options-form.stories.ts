// TODO: STORYBOOK_AUDIT

// import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { DomainsIdentityUiDeviceLookupModule } from '../domains-identity-ui-device-lookup.module';
//
// const stories = storiesOf('Domains/Identity/DeviceLookupIdOptionsFormComponent', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DomainsIdentityUiDeviceLookupModule],
//             providers: [TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER]
//         })
//     )
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     template: `
//         <device-lookup-id-options-form
//             #deviceLookupIdOptionsForm
//             (deviceIdSelected)="onDeviceIdSelected($event); deviceLookupIdOptionsForm.completedProcessing()"
//         ></device-lookup-id-options-form>
//     `,
//     props: {
//         onDeviceIdSelected: action('@Output() deviceIdSelected')
//     }
// }));
