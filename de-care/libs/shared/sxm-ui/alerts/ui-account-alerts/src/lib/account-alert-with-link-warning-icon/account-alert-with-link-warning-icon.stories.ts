import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiAccountAlertWithLinkWarningIconModule } from './account-alert-with-link-warning-icon.component';

const stories = storiesOf('Component Library/Alerts/AccountAlertWithLinkWarningIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAccountAlertWithLinkWarningIconModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

const alertData = {
    copyContent: 'Your trial ends in 23 days.',
    urlLink: 'https://care.siriusxm.com/subscribe/checkout/flepz?programcode=TRIALEXT',
    urlLinkLabel: 'Get 3 more months',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-account-alert-with-link-warning-icon [data]="data"></sxm-ui-account-alert-with-link-warning-icon>
    `,
    props: {
        data: alertData,
    },
}));
