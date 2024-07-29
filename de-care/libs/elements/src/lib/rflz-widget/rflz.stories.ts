// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { DataTrialService } from '@de-care/data-services';
// import { RadioIdLookupService } from '@de-care/identification';
// import { RflzWidgetComponent } from './rflz-widget.component';
// import { ElementsSettingsToken } from '../elements-settings-token';
// import { ElementsModule } from '../elements.module';
// import { of } from 'rxjs';
// import { SettingsService } from '@de-care/settings';
//
// const stories = storiesOf('elements/rflz-widget', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [ElementsModule],
//             providers: [{ provide: ElementsSettingsToken, useValue: { rflzSuccessUrl: '' } }]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('with error response on submit', () => ({
//     component: RflzWidgetComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: DataTrialService, useValue: { usedCarEligibilityCheck: () => of({ success: false, errorMessage: '3494' }) } },
//             { provide: RadioIdLookupService, useValue: {} }
//         ]
//     }
// }));
//
// stories.add('with error response on submit - CA', () => ({
//     component: RflzWidgetComponent,
//     moduleMetadata: {
//         providers: [
//             { provide: SettingsService, useValue: { isCanadaMode: true, dateFormat: 'MM/dd/yy', settings: { country: 'ca' } } },
//             { provide: DataTrialService, useValue: { usedCarEligibilityCheck: () => of({ success: false, errorMessage: '3494' }) } },
//             { provide: RadioIdLookupService, useValue: {} }
//         ]
//     }
// }));
