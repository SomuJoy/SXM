import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiAccountAlertWithNoLinkCheckmarkIconModule } from './account-alert-with-no-link-checkmark-icon.component';

const stories = storiesOf('Component Library/Alerts/AccountAlertWithNoLinkCheckmarkIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAccountAlertWithNoLinkCheckmarkIconModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const alertData = {
    copyContent: 'Your account is all set',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-account-alert-with-no-link-checkmark-icon [data]="data"></sxm-ui-account-alert-with-no-link-checkmark-icon>
    `,
    props: {
        data: alertData,
    },
}));
