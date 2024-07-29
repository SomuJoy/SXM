// TODO: STORYBOOK_AUDIT

// import { HttpClientModule } from '@angular/common/http';
// import { RouterTestingModule } from '@angular/router/testing';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { TRANSLATE_PROVIDERS, MOCK_DATA_LAYER_PROVIDER, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DoNotCallFlowComponent } from './do-not-call-flow.component';
// import { DoNotCallModule } from '../../do-not-call.module';
// import { DataAccountManagementService, DataUtilityService } from '@de-care/data-services';
// import { of } from 'rxjs';
// import { StoreModule } from '@ngrx/store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//
// const stories = storiesOf('do-not-call/do-not-call-flow', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DoNotCallModule, RouterTestingModule, HttpClientModule, StoreModule.forRoot({}), StoreDevtoolsModule.instrument()],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 MOCK_DATA_LAYER_PROVIDER,
//                 { provide: DataAccountManagementService, useValue: { donotcall: () => of({ resultCode: 'Success' }) } },
//                 { provide: DataUtilityService, useValue: { getNuCaptcha: () => of() } }
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: DoNotCallFlowComponent
// }));
//
// stories.add('will fail for any phone number', () => ({
//     component: DoNotCallFlowComponent,
//     moduleMetadata: {
//         providers: [{ provide: DataAccountManagementService, useValue: { donotcall: () => of({ resultCode: 'Error' }) } }]
//     }
// }));
