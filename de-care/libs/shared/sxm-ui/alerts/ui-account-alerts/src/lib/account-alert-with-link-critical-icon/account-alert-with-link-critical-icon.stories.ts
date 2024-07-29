import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiAccountAlertWithLinkCriticalIconModule } from './account-alert-with-link-critical-icon.component';

const stories = storiesOf('Component Library/Alerts/AccountAlertWithLinkCriticalIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAccountAlertWithLinkCriticalIconModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

const alertData = {
    copyContent: 'Your payment in the amount of $21.32 is overdue.',
    urlLink: 'https://care.siriusxm.com/makeccpaymentlogin_view.action?isflepzview=true#/ccpaymentflepz',
    urlLinkLabel: 'Make a payment now',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-account-alert-with-link-critical-icon [data]="data"></sxm-ui-account-alert-with-link-critical-icon>
    `,
    props: {
        data: alertData,
    },
}));
