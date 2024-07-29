import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule } from './streaming-subscription-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/StreamingSubscriptionActions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    plans: ['Streaming Platinum'],
    username: 'barret.wallace@gmail.com',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-streaming-subscription-actions [data]="data" (manage)="onManage()" (editUsername)="onEditUsername()"></sxm-ui-streaming-subscription-actions>
    `,
    props: {
        data: subData,
        onManage: action('manage clicked'),
        onEditUsername: action('edit username clicked'),
    },
}));
