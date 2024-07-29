// TODO: STORYBOOK_AUDIT

// import { withKnobs, object } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { ValidateLpzFormComponent } from './validate-lpz-form.component';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { IdentificationModule } from '../../identification.module';
// import { of } from 'rxjs';
// import { DataAccountService } from '@de-care/data-services';
//
// const stories = storiesOf('identification/validate-lpz-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: ValidateLpzFormComponent,
//     moduleMetadata: {
//         providers: [MOCK_DATA_LAYER_PROVIDER, { provide: DataAccountService, useValue: { verify: () => of(true) } }]
//     },
//     props: {
//         lpzInfo: object('accountInfo', {
//             lastName: '',
//             phoneNumber: '',
//             zipCode: ''
//         }),
//         verified: action('@Output verified emitted')
//     }
// }));
//
// stories.add('with notification on validation fail', () => ({
//     component: ValidateLpzFormComponent,
//     moduleMetadata: {
//         providers: [MOCK_DATA_LAYER_PROVIDER, { provide: DataAccountService, useValue: { verify: () => of(false) } }]
//     },
//     props: {
//         lpzInfo: object('accountInfo', {
//             lastName: '',
//             phoneNumber: '',
//             zipCode: ''
//         }),
//         verified: action('@Output verified emitted'),
//         invalidUserInfo: action('@Output invalidUserInfo emitted')
//     }
// }));
//
// stories.add('with inline error on validation fail', () => ({
//     component: ValidateLpzFormComponent,
//     moduleMetadata: {
//         providers: [MOCK_DATA_LAYER_PROVIDER, { provide: DataAccountService, useValue: { verify: () => of(false) } }]
//     },
//     props: {
//         lpzInfo: object('accountInfo', {
//             lastName: '',
//             phoneNumber: '',
//             zipCode: ''
//         }),
//         verified: action('@Output verified emitted')
//     }
// }));
