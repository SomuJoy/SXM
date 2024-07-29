// import { moduleMetadata, storiesOf } from '@storybook/angular';
// import { withA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import { CancelLinksHybridBauComponent } from './cancel-links-hybrid-bau.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
// import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
// import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';

// const stories = storiesOf('Component Library/SubscriptionDetails/CancelLinksHybridBau', module)
//     .addDecorator(withA11y)
//     .addDecorator(withKnobs)
//     .addDecorator(
//         moduleMetadata({
//             imports: [TranslateModule.forRoot(), CancelLinksHybridBauComponent, SharedSxmUiUiModalModule],
//             providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
//         })
//     )
//     .addDecorator(withTranslation);

// const linkData = { types: ['CANCEL', 'TRANSFER', 'CHAT', 'CALL'], subscriptionId: '10000204459' };

// stories.add('default', () => ({
//     template: `
//         <my-account-cancel-links-hybrid-bau [data]="data"></my-account-cancel-links-hybrid-bau>
//     `,
//     props: {
//         data: linkData,
//     },
// }));

// stories.add('In modal', () => ({
//     template: `
//     <sxm-ui-modal [closed]="false" titlePresent="true" [title]="'Subscription'">
//         <my-account-cancel-links-hybrid-bau [data]="data"></my-account-cancel-links-hybrid-bau>
//     </sxm-ui-modal>
//     `,
//     props: {
//         data: linkData,
//     },
// }));
