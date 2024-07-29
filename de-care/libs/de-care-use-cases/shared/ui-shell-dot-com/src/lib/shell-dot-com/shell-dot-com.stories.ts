// TODO: STORYBOOK_AUDIT

// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { DeCareUseCasesSharedUiShellDotComModule } from '../de-care-use-cases-shared-ui-shell-dot-com.module';
// import { TRANSLATE_PROVIDERS, TRANSLATE_PROVIDERS_CA, TRANSLATE_PROVIDERS_CA_FR, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { provideMockStore } from '@ngrx/store/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { SettingsService } from '@de-care/settings';
// import { action } from '@storybook/addon-actions';
//
// const stories = storiesOf('de-care-use-cases/shared/shell', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesSharedUiShellDotComModule, RouterTestingModule]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default US', () => ({
//     template: `<de-care-shell></de-care-shell>`,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS,
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             provideMockStore({
//                 initialState: {
//                     appSettings: {
//                         country: 'us'
//                     },
//                     customerLocale: {
//                         province: 'ON',
//                         provinceSelectionDisabled: false,
//                         provinceSelectionVisible: false,
//                         language: 'en-US',
//                         provinces: []
//                     }
//                 }
//             })
//         ]
//     }
// }));
//
// stories.add('default CA', () => ({
//     template: `<de-care-shell></de-care-shell>`,
//     moduleMetadata: {
//         providers: [
//             ...TRANSLATE_PROVIDERS_CA,
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             provideMockStore({
//                 initialState: {
//                     appSettings: {
//                         country: 'ca'
//                     },
//                     customerLocale: {
//                         province: 'ON',
//                         provinceSelectionDisabled: false,
//                         provinceSelectionVisible: false,
//                         language: 'en-ca',
//                         provinces: []
//                     }
//                 }
//             })
//         ]
//     }
// }));
