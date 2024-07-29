// TODO: STORYBOOK_AUDIT

// import { RouterTestingModule } from '@angular/router/testing';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { MOCK_DATA_LAYER_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DoNotCallFormComponent } from './do-not-call-form.component';
// import { DoNotCallModule } from '../../do-not-call.module';
// import { DataAccountManagementService, DataUtilityService } from '@de-care/data-services';
// import { of } from 'rxjs';
//
// const stories = storiesOf('do-not-call/do-not-call-form', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [DoNotCallModule, RouterTestingModule],
//             providers: [
//                 ...TRANSLATE_PROVIDERS,
//                 { provide: DataAccountManagementService, useValue: { donotcall: () => of() } },
//                 { provide: DataUtilityService, useValue: { getNuCaptcha: () => of() } },
//                 MOCK_DATA_LAYER_PROVIDER
//             ]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: DoNotCallFormComponent,
//     props: {}
// }));
