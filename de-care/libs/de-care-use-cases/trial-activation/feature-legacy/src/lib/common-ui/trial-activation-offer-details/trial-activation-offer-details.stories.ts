// TODO: STORYBOOK_AUDIT

// import { storiesOf, moduleMetadata } from '@storybook/angular';
// import { withKnobs } from '@storybook/addon-knobs';
// import { withA11y } from '@storybook/addon-a11y';
// import { withMockSettings, withTranslation, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
// import { TrialActivationModule } from '../../trial-activation.module';
// import { TrialActivationOfferDetailsComponent } from './trial-activation-offer-details.component';
// import { UserSettingsService } from '@de-care/settings';
// import { of } from 'rxjs';
//
// const stories = storiesOf('trial-activation/common-ui/offer-details', module)
//     .addDecorator(withKnobs)
//     .addDecorator(withA11y)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TrialActivationModule],
//             providers: [...TRANSLATE_PROVIDERS]
//         })
//     )
//     .addDecorator(withMockSettings)
//     .addDecorator(withTranslation);
//
// stories.add('default', () => ({
//     component: TrialActivationOfferDetailsComponent
// }));
//
// stories.add('in Quebec', () => ({
//     component: TrialActivationOfferDetailsComponent,
//     moduleMetadata: {
//         providers: [{ provide: UserSettingsService, useValue: { isQuebec$: of(true) } }]
//     }
// }));
