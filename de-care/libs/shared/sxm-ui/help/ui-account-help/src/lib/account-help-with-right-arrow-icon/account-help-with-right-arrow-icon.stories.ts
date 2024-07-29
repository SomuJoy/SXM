import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiAccountHelpWithRightArrowIconModule } from './account-help-with-right-arrow-icon.component';

const stories = storiesOf('Component Library/Help/CopyWithRightArrow', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAccountHelpWithRightArrowIconModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const copy = 'How do I change or cancel service?';

stories.add('default', () => ({
    template: `
        <sxm-ui-account-help-with-right-arrow-icon [data]="data"></sxm-ui-account-help-with-right-arrow-icon>
    `,
    props: {
        data: copy,
    },
}));
