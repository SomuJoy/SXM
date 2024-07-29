import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule } from './active-subscription-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/ActiveSubscriptionActions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    vehicle: '2021 Honda Civic',
    radioId: '990005525221',
    plans: ['Streaming Music & Entertainment', 'Travel Link Trial', 'Traffic Trial'],
    username: '',
    streamingServiceStatus: false,
};

stories.add('vehicle, multiple subs, no username', () => ({
    template: `
        <sxm-ui-active-subscription-actions [data]="data" (manage)="onManage()" (editUsername)="onEditUsername()"></sxm-ui-active-subscription-actions>
    `,
    props: {
        data: subData,
        onManage: action('manage clicked'),
        onEditUsername: action('edit username clicked'),
    },
}));

stories.add('long nickname, single sub, username', () => ({
    template: `
        <sxm-ui-active-subscription-actions [data]="data" (manage)="onManage()" (editUsername)="onEditUsername()"></sxm-ui-active-subscription-actions>
    `,
    props: {
        data: { ...subData, vehicle: 'Roach the Amazing Wonder Horse', plans: ['Platinum'], username: 'geralt.rivia@gmail.com', streamingServiceStatus: true },
        onManage: action('manage clicked'),
        onEditUsername: action('edit username clicked'),
    },
}));

stories.add('no vehicle, single sub, username', () => ({
    template: `
        <sxm-ui-active-subscription-actions [data]="data" (manage)="onManage()" (editUsername)="onEditUsername()"></sxm-ui-active-subscription-actions>
    `,
    props: {
        data: { ...subData, vehicle: '', plans: ['Platinum'], username: 'geralt.rivia@gmail.com', streamingServiceStatus: true },
        onManage: action('manage clicked'),
        onEditUsername: action('edit username clicked'),
    },
}));
