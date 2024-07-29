import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiAccountHelpFaqCardModule } from './account-help-faq-card.component';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Help/FaqCard', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiAccountHelpFaqCardModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-account-help-faq-card (activate)="onActivatePlan()"></sxm-ui-account-help-faq-card>`,
    props: {
        onActivatePlan: action('Navigate to vanity URL'),
    },
}));
