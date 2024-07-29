// TODO: STORYBOOK_AUDIT

// import { APP_HEADER_STORYBOOK_STORIES } from '../app-header.stories';
// import { object } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { SettingsService } from '@de-care/settings';
// import { ProvinceSelectorComponent } from './province-selector.component';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { DataUtilityService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// const mockProvinceProviders = [
//     { provide: SettingsService, useValue: { isCanadaMode: true } },
//     MOCK_DATA_LAYER_PROVIDER,
//     MOCK_NGRX_STORE_PROVIDER,
//     { provide: DataUtilityService, useValue: { getIp2LocationInfo: () => of() } }
// ];
// APP_HEADER_STORYBOOK_STORIES.add('province-selector: standalone', () => ({
//     component: ProvinceSelectorComponent,
//     template: `
//         <header>
//             <province-selector
//                 ></province-selector>
//         </header>
//     `,
//     moduleMetadata: {
//         providers: [...mockProvinceProviders]
//     },
//     props: {
//         languageSelected: action('@Output() languageSelected')
//     }
// }));
//
// APP_HEADER_STORYBOOK_STORIES.add('province-selector: in modal', () => ({
//     component: ProvinceSelectorComponent,
//     template: `
//         <sxm-ui-modal [closed]="false" title="Site Settings" [titlePresent]="true">
//             <province-selector
//                 ></province-selector>
//         </sxm-ui-modal>
//     `,
//     moduleMetadata: {
//         imports: [SxmUiModule],
//         providers: [...mockProvinceProviders]
//     },
//     props: {
//         languageSelected: action('@Output() languageSelected')
//     }
// }));
