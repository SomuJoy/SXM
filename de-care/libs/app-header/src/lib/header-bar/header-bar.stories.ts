// TODO: STORYBOOK_AUDIT

// import { APP_HEADER_STORYBOOK_STORIES } from '../app-header.stories';
// import { object } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { SettingsService, UserSettingsService } from '@de-care/settings';
// import { HeaderBarComponent, LogoData } from './header-bar.component';
// import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { DataUtilityService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// APP_HEADER_STORYBOOK_STORIES.add('header-bar: in us', () => ({
//     component: HeaderBarComponent,
//     template: `
//         <header style="background-color: gray">
//             <header-bar class="sxm-limited-nav" [logoData]="logoData"></header-bar>
//         </header>
//     `,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: false } },
//             { provide: UserSettingsService, useValue: { provinceSelectionVisible$: of(false) } },
//             MOCK_DATA_LAYER_PROVIDER
//         ]
//     },
//     props: {
//         logoData: object('@Input() logoData', {
//             url: 'https://www.siriusxm.com/',
//             imageSrcUrl: 'assets/img/sxm-logo-white.png'
//         } as LogoData)
//     }
// }));
//
// APP_HEADER_STORYBOOK_STORIES.add('header-bar: in canada', () => ({
//     component: HeaderBarComponent,
//     template: `
//         <header style="background-color: gray">
//             <header-bar class="sxm-limited-nav"
//                 (languageSelected)="languageSelected($event)"
//                 [logoData]="logoData"></header-bar>
//         </header>
//     `,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true } },
//             MOCK_DATA_LAYER_PROVIDER,
//             MOCK_NGRX_STORE_PROVIDER,
//             { provide: DataUtilityService, useValue: { getIp2LocationInfo: () => of() } },
//             { provide: UserSettingsService, useValue: { provinceSelectionVisible$: of(true) } }
//         ]
//     },
//     props: {
//         logoData: object('@Input() logoData', {
//             url: 'https://www.siriusxm.com/',
//             imageSrcUrl: 'assets/img/sxm-logo-white.png'
//         } as LogoData),
//         languageSelected: action('@Output() languageSelected')
//     }
// }));
