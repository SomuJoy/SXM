// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { SuccessPageComponent } from './success-page.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule } from '../../de-care-use-cases-third-party-linking-feature-device-link-amazon.module';
// import { withCommonDependencies, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { SettingsService } from '@de-care/settings';
// const stories = storiesOf('de-care-use-cases/third-party-linking/success-page', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('Default', () => ({
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } }]
//     },
//     component: SuccessPageComponent
// }));
