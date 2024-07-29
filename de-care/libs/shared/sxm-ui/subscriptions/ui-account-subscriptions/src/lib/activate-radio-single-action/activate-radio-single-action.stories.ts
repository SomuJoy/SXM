import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule } from './activate-radio-single-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/ActivateRadioSingleAction', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    plan: 'Music & Entertainment',
    price: '$8/mo',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-activate-radio-single-action [data]="data" (activatePlan)="onActivatePlan()"></sxm-ui-activate-radio-single-action>
    `,
    props: {
        data: subData,
        onActivatePlan: action('activate plan clicked'),
    },
}));
