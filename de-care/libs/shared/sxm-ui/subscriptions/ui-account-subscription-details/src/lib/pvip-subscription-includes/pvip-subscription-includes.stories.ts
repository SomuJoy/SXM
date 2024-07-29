import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiPvipSubscriptionIncludesModule } from './pvip-subscription-includes.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { DOT_COM_URL } from '@de-care/shared/configuration-tokens-dot-com';

const stories = storiesOf('Component Library/SubscriptionDetails/PvipSubscriptionIncludes', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiPvipSubscriptionIncludesModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: DOT_COM_URL, useValue: 'https://www.siriusxm.com' },
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <sxm-ui-pvip-subscription-includes></sxm-ui-pvip-subscription-includes>
    `,
    props: {},
}));
