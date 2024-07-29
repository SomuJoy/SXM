import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule } from './upgrade-subscription-single-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/UpgradeSubscriptionSingleAction', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    plan: 'Platinum',
    price: '$8/mo',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-upgrade-subscription-single-action [data]="data" (upgradePlan)="onUpgradePlan()"></sxm-ui-upgrade-subscription-single-action>
    `,
    props: {
        data: subData,
        onUpgradePlan: action('upgrade plan clicked'),
    },
}));
