// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { TranslateModule } from '@ngx-translate/core';
// import { DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule } from '../../de-care-use-cases-third-party-linking-feature-device-link-amazon.module';
// import { withCommonDependencies, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { LandingPageComponent } from './landing-page.component';
// import { LinkDeviceWorkflowService } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-amazon';
// import { of } from 'rxjs';
// import { SettingsService } from '@de-care/settings';
// const stories = storiesOf('de-care-use-cases/third-party-linking/landing-page', module)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule],
//             providers: [
//                 {
//                     provide: LinkDeviceWorkflowService,
//                     useValue: {
//                         build: () => of(true)
//                     }
//                 },
//                 ...TRANSLATE_PROVIDERS
//             ]
//         })
//     )
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(withCommonDependencies)
//     .addDecorator(withTranslation);
//
// stories.add('Redirect 1', () => ({
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } }]
//     },
//     component: LandingPageComponent,
//     props: {
//         amazonUri: of('http://www.amazon.com'),
//         amazonLoginOpened$: of(false)
//     }
// }));
//
// stories.add('Redirect 2', () => ({
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } }]
//     },
//     component: LandingPageComponent,
//     props: {
//         amazonUri: of('http://www.amazon.com'),
//         amazonLoginOpened$: of(true)
//     }
// }));
