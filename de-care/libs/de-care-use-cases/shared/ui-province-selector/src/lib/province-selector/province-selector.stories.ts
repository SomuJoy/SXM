// TODO: STORYBOOK_AUDIT

// import { DataUtilityService } from '@de-care/data-services';
// import { SettingsService } from '@de-care/settings';
// import { SxmUiModule } from '@de-care/sxm-ui';
// import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
// import { withKnobs, object } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { of } from 'rxjs';
// import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { ProvinceSelectorComponent } from './province-selector.component';
// import { DeCareUseCasesSharedUiProvinceSelectorModule } from '../de-care-use-cases-shared-ui-province-selector.module';
//
// const mockProvinceProviders = [
//     { provide: SettingsService, useValue: { isCanadaMode: true } },
//     MOCK_DATA_LAYER_PROVIDER,
//     MOCK_NGRX_STORE_PROVIDER,
//     { provide: DataUtilityService, useValue: { getIp2LocationInfo: () => of() } }
// ];
//
// const APP_HEADER_STORYBOOK_STORIES = storiesOf('de-care-province-selector', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DeCareUseCasesSharedUiProvinceSelectorModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// APP_HEADER_STORYBOOK_STORIES.add('province-selector: standalone', () => ({
//     component: ProvinceSelectorComponent,
//     template: `
//         <header>
//             <de-care-province-selector [provinces]="provinces"></de-care-province-selector>
//         </header>
//     `,
//     moduleMetadata: {
//         providers: [...mockProvinceProviders]
//     },
//     props: {
//         provinces: object('@Input() provinces', [
//             { label: 'ALASKA', key: 'AK' },
//             { label: 'ALABAMA', key: 'AL' },
//             { label: 'ARKANSAS', key: 'AR' },
//             { label: 'ARIZONA', key: 'AZ' },
//             { label: 'CALIFORNIA', key: 'CA' },
//             { label: 'COLORADO', key: 'CO' },
//             { label: 'CONNECTICUT', key: 'CT' },
//             { label: 'DISTRICT OF COLUMBIA', key: 'DC' },
//             { label: 'DELAWARE', key: 'DE' },
//             { label: 'FLORIDA', key: 'FL' },
//             { label: 'GEORGIA', key: 'GA' },
//             { label: 'HAWAII', key: 'HI' },
//             { label: 'IOWA', key: 'IA' },
//             { label: 'IDAHO', key: 'ID' },
//             { label: 'ILLINOIS', key: 'IL' },
//             { label: 'INDIANA', key: 'IN' },
//             { label: 'KANSAS', key: 'KS' },
//             { label: 'KENTUCKY', key: 'KY' },
//             { label: 'LOUISIANA', key: 'LA' },
//             { label: 'MASSACHUSETTS', key: 'MA' },
//             { label: 'MARYLAND', key: 'MD' },
//             { label: 'MAINE', key: 'ME' },
//             { label: 'MICHIGAN', key: 'MI' },
//             { label: 'MINNESOTA', key: 'MN' },
//             { label: 'MISSOURI', key: 'MO' },
//             { label: 'MISSISSIPPI', key: 'MS' },
//             { label: 'MONTANA', key: 'MT' },
//             { label: 'NORTH CAROLINA', key: 'NC' },
//             { label: 'NORTH DAKOTA', key: 'ND' },
//             { label: 'NEW ENGLAND', key: 'NE' },
//             { label: 'NEW HAMPSHIRE', key: 'NH' },
//             { label: 'NEW JERSEY', key: 'NJ' },
//             { label: 'NEW MEXICO', key: 'NM' },
//             { label: 'NEVADA', key: 'NV' },
//             { label: 'NEW YORK', key: 'NY' },
//             { label: 'OHIO', key: 'OH' },
//             { label: 'OKLAHOMA', key: 'OK' },
//             { label: 'OREGON', key: 'OR' },
//             { label: 'PENNSYLVANIA', key: 'PA' },
//             { label: 'RHODE ISLAND', key: 'RI' },
//             { label: 'SOUTH CAROLINA', key: 'SC' },
//             { label: 'SOUTH DAKOTA', key: 'SD' },
//             { label: 'TENNESSEE', key: 'TN' },
//             { label: 'TEXAS', key: 'TX' },
//             { label: 'UTAH', key: 'UT' },
//             { label: 'VIRGINIA', key: 'VA' },
//             { label: 'VERMONT', key: 'VT' },
//             { label: 'WASHINGTON', key: 'WA' },
//             { label: 'WISCONSIN', key: 'WI' },
//             { label: 'WEST VIRGINIA', key: 'WV' },
//             { label: 'WYOMING', key: 'WY' }
//         ]),
//         languageSelected: action('@Output() languageSelected')
//     }
// }));
//
// APP_HEADER_STORYBOOK_STORIES.add('province-selector: in modal', () => ({
//     component: ProvinceSelectorComponent,
//     template: `
//         <sxm-ui-modal [closed]="false" title="Site Settings" [titlePresent]="true">
//             <de-care-province-selector
//                 ></de-care-province-selector>
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
