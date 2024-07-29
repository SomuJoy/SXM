import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiManageStreamingSubscriptionHeaderModule } from './manage-streaming-subscription-header.component';

const stories = storiesOf('Component Library/Subscriptions/ManageStreamingSubscriptionHeader', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiManageStreamingSubscriptionHeaderModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <sxm-ui-manage-streaming-subscription-header (back)="back()"></sxm-ui-manage-streaming-subscription-header>
    `,
    props: {
        back: action('back clicked'),
    },
}));
