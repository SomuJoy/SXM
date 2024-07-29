// TODO: STORYBOOK_AUDIT

// import { of } from 'rxjs';
// import { MOCK_DATA_LAYER_PROVIDER } from '@de-care/shared/storybook/util-helpers';
// import { DataAccountService, DataIdentityService, DataOfferService } from '@de-care/data-services';
// import { VerifyDeviceTabsComponent } from '../../lookup/verify-device-tabs/verify-device-tabs.component';
// import { CookieService } from 'ngx-cookie-service';
// import { IDENTIFICATION_STORYBOOK_STORIES } from '../../identification.stories';
// import { ActivatedRoute, convertToParamMap } from '@angular/router';
//
// IDENTIFICATION_STORYBOOK_STORIES.add('verify-device-tabs', () => ({
//     component: VerifyDeviceTabsComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataAccountService, useValue: {} },
//             MOCK_DATA_LAYER_PROVIDER,
//             {
//                 provide: DataOfferService,
//                 useValue: {
//                     allPackageDescriptions: () => of([]),
//                     radio: () => of({}),
//                     customer: () => of({})
//                 }
//             },
//             // Stuff for child components
//             { provide: DataIdentityService, useValue: {} },
//             { provide: CookieService, useValue: {} },
//             {
//                 provide: ActivatedRoute,
//                 useValue: {
//                     snapshot: {
//                         queryParamMap: convertToParamMap({ searchMode: '' })
//                     }
//                 }
//             }
//         ]
//     },
//     props: {}
// }));
