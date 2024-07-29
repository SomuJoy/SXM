import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SxmUiAccountAlertWithLinkNoIconModule } from './account-alert-with-link-no-icon.component';

const stories = storiesOf('Component Library/Alerts/AccountAlertWithLinkNoIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiAccountAlertWithLinkNoIconModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

const alertData = {
    copyContent: 'Want to stream SiriusXM?',
    urlLink: 'https://care.siriusxm.com/onboarding/setup-credentials',
    urlLinkLabel: 'Create SXM App login',
};

const noticeData = {
    copyContent: '<strong>Important Notice:</strong> Effective March 14th, 2023, the monthly rate for your plan will increase.',
    urlLink: 'https://www.siriusxm.com/mar2023rates',
    urlLinkLabel: 'Learn more',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-account-alert-with-link-no-icon [data]="data"></sxm-ui-account-alert-with-link-no-icon>
    `,
    props: {
        data: alertData,
    },
}));

stories.add('highlight link', () => ({
    template: `
        <sxm-ui-account-alert-with-link-no-icon [data]="data" class="highlight-link"></sxm-ui-account-alert-with-link-no-icon>
    `,
    props: {
        data: alertData,
    },
}));

stories.add('important notice message', () => ({
    template: `
        <sxm-ui-account-alert-with-link-no-icon [data]="data"></sxm-ui-account-alert-with-link-no-icon>
    `,
    props: {
        data: noticeData,
    },
}));
