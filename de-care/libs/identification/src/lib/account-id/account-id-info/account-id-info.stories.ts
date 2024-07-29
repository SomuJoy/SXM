// TODO: STORYBOOK_AUDIT

// import { withKnobs } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
// import { withCommonDependencies, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { AccountIdInfoComponent } from './account-id-info.component';
// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { IdentificationModule } from '../../identification.module';
// import { SettingsService } from '@de-care/settings';
//
// const stories = storiesOf('identification', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [IdentificationModule]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation)
//     .addDecorator(withCommonDependencies);
//
// stories.add('account-id-info', () => ({
//     component: AccountIdInfoComponent,
//     props: {
//         deviceHelp: action('@Output() deviceHelp emitted')
//     }
// }));
//
// stories.add('account-id-info: in canada', () => ({
//     component: AccountIdInfoComponent,
//     moduleMetadata: {
//         providers: [{ provide: SettingsService, useValue: { isCanadaMode: true, settings: { country: 'ca' } } }]
//     },
//     props: {
//         deviceHelp: action('@Output() deviceHelp emitted')
//     }
// }));
