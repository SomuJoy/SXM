import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiAccountAlertWithLinkTagIconModule } from './account-alert-with-link-tag-icon.component';

const stories = storiesOf('Component Library/Alerts/AccountAlertWithLinkTagIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAccountAlertWithLinkTagIconModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

const alertData = {
    copyContent: 'Like what you hear? Get even more great content.',
    urlLink: 'https://care.siriusxm.com/subscription/change?subscriptionId=10000223686',
    urlLinkLabel: 'Upgrade now',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-account-alert-with-link-tag-icon [data]="data"></sxm-ui-account-alert-with-link-tag-icon>
    `,
    props: {
        data: alertData,
    },
}));
