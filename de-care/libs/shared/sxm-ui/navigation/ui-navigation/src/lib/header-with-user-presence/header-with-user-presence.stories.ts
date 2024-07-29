import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiHeaderWithUserPresenceModule } from './header-with-user-presence.component';

const stories = storiesOf('Component Library/Navigation/HeaderWithUserPresence', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiHeaderWithUserPresenceModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <sxm-ui-header-with-user-presence></sxm-ui-header-with-user-presence>
    `,
    props: {},
}));
