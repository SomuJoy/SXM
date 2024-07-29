// TODO: STORYBOOK_AUDIT

// import { IdentificationModule } from '../../identification.module';
// import { withA11y } from '@storybook/addon-a11y';
// import { object, select, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { RflzErrorComponent } from './rflz-error.component';
//
// const stories = storiesOf('identification/rflz-error', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule],
//             providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('error code', () => ({
//     template: `<div style="padding: 20px;"><rflz-error [errorCode]="errorCode" [errorMsgData]="errorMsgData"></rflz-error></div>`,
//     moduleMetadata: {
//         imports: [IdentificationModule],
//         providers: [],
//     },
//     props: {
//         errorCode: select(
//             '@Input() errorCode',
//             {
//                 Default: '',
//                 3494: '3494',
//                 5035: '5035',
//                 101: '101',
//                 103: '103',
//                 106: '106',
//                 107: '107',
//                 109: '109',
//                 110: '110',
//                 111: '111',
//                 112: '112',
//                 113: '113',
//                 114: '114',
//             },
//             ''
//         ),
//         errorMsgData: object('@Input() errorMsgData', { lastName: 'Smith', radioId: '1233' }),
//     },
// }));
