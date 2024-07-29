// TODO: STORYBOOK_AUDIT

// import { provideMockStore } from '@ngrx/store/testing';
// import { DataUtilityService } from '@de-care/data-services';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { object, withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { HeaderBarComponent, LogoData } from './header-bar.component';
// import { DeCareUseCasesSharedUiHeaderBarModule } from '../de-care-use-cases-shared-ui-header-bar.module';
//
// const APP_HEADER_STORYBOOK_STORIES = storiesOf('de-care-header-bar', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesSharedUiHeaderBarModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// APP_HEADER_STORYBOOK_STORIES.add('header-bar: in us', () => ({
//     component: HeaderBarComponent,
//     template: `
//         <header style="background-color: gray">
//             <de-care-header-bar class="sxm-limited-nav" [logoData]="logoData"></de-care-header-bar>
//         </header>
//     `,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             { provide: UserSettingsService, useValue: { provinceSelectionVisible$: of(false) } },
//             MOCK_DATA_LAYER_PROVIDER,
//             provideMockStore({
//                 initialState: {
//                     appSettings: {
//                         country: 'us'
//                     },
//                     customerLocale: {
//                         province: 'ON',
//                         provinceSelectionDisabled: false,
//                         provinceSelectionVisible: false,
//                         language: 'en-us',
//                         provinces: []
//                     }
//                 }
//             })
//         ]
//     },
//     props: {
//         logoData: object('@Input() logoData', {
//             link: 'https://www.siriusxm.com/',
//             imageSrc: 'assets/img/sxm-logo-white.png'
//         } as LogoData)
//     }
// }));
//
// APP_HEADER_STORYBOOK_STORIES.add('header-bar: in canada', () => ({
//     component: HeaderBarComponent,
//     template: `
//         <header style="background-color: gray">
//             <de-care-header-bar class="sxm-limited-nav"
//                 (languageSelected)="languageSelected($event)"
//                 [logoData]="logoData"></de-care-header-bar>
//         </header>
//     `,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             MOCK_DATA_LAYER_PROVIDER,
//             MOCK_NGRX_STORE_PROVIDER,
//             { provide: DataUtilityService, useValue: { getIp2LocationInfo: () => of() } },
//             provideMockStore({
//                 initialState: {
//                     appSettings: {
//                         country: 'ca'
//                     },
//                     customerLocale: {
//                         province: 'ON',
//                         provinceSelectionDisabled: false,
//                         provinceSelectionVisible: false,
//                         language: 'en-us',
//                         provinces: []
//                     }
//                 }
//             })
//         ]
//     },
//     props: {
//         logoData: object('@Input() logoData', {
//             link: 'https://www.siriusxm.com/',
//             imageSrc: 'assets/img/sxm-logo-white.png'
//         } as LogoData),
//         languageSelected: action('@Output() languageSelected')
//     }
// }));
