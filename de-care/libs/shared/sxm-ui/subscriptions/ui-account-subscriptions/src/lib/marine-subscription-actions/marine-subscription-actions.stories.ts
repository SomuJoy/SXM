import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule } from './marine-subscription-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/MarineSubscriptionActions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    vehicle: 'Boat',
    radioId: '990005525221',
    plans: ['Platinum Trial', 'Travel Link Trial', 'Traffic Trial'],
    username: 'francis.drake@gmail.com',
    streamingServiceStatus: false,
};

stories.add('default', () => ({
    template: `
        <sxm-ui-marine-subscription-actions [data]="data" (manage)="onManage()" (editUsername)="onEditUsername()"></sxm-ui-marine-subscription-actions>
    `,
    props: {
        data: subData,
        onManage: action('manage clicked'),
        onEditUsername: action('edit username clicked'),
    },
}));

stories.add('with streaming', () => ({
    template: `
        <sxm-ui-marine-subscription-actions [data]="data" (manage)="onManage()" (editUsername)="onEditUsername()"></sxm-ui-marine-subscription-actions>
    `,
    props: {
        data: { ...subData, streamingServiceStatus: true },
        onManage: action('manage clicked'),
        onEditUsername: action('edit username clicked'),
    },
}));
