import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionDetailsUiSelfpaySubscriptionDetailsModule } from './selfpay-subscription-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/SubscriptionDetails/SelfpaySubscriptionDetails', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionDetailsUiSelfpaySubscriptionDetailsModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    planName: ['Platinum'],
    term: 3,
    planUrl: '',
};

const subData2 = {
    planName: ['Music & Entertainment'],
    term: 12,
    planUrl: '',
};

const subDataWithFollowons = {
    planName: ['Platinum'],
    term: 1,
    planUrl: 'siriusxm.com',
    followOnPlans: [
        {
            planName: 'Music & Entertainment',
            startDate: '2022-10-29T00:00:00-04:00',
            endDate: '2023-03-29T00:00:00-04:00',
            term: 6,
            type: 'PROMO',
        },
        {
            planName: 'Music & Entertainment',
            startDate: '2023-03-29T00:00:00-04:00',
            endDate: null,
            term: 6,
            type: 'SELF_PAID',
        },
    ],
};

const subDataWithFollowonNoEndDate = {
    planName: ['Platinum'],
    term: 1,
    planUrl: 'siriusxm.com',
    followOnPlans: [
        {
            planName: 'Music & Entertainment Advantage',
            startDate: '2022-10-29T00:00:00-04:00',
            endDate: null,
            term: 0,
            type: 'PROMO_MCP',
        },
    ],
};

const dropdownListData = [
    { label: 'Change my plan', url: '' },
    { label: 'Change my billing plan', url: '' },
    { label: 'Refresh radio signal', url: '' },
    { label: 'Transfer subscription', url: '' },
    { label: 'Replace this radio', url: '' },
    { label: 'Cancel subscription', url: '' },
];

stories.add('default', () => ({
    template: `
        <sxm-ui-selfpay-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-selfpay-subscription-details>
    `,
    props: {
        data: subData,
        dropdownListData,
    },
}));

stories.add('annual plan', () => ({
    template: `
        <sxm-ui-selfpay-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-selfpay-subscription-details>
    `,
    props: {
        data: subData2,
        dropdownListData,
    },
}));

stories.add('with follow on plans', () => ({
    template: `
        <sxm-ui-selfpay-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-selfpay-subscription-details>
    `,
    props: {
        data: subDataWithFollowons,
        dropdownListData,
    },
}));

stories.add('with follow on plan with no end date', () => ({
    template: `
        <sxm-ui-selfpay-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-selfpay-subscription-details>
    `,
    props: {
        data: subDataWithFollowonNoEndDate,
        dropdownListData,
    },
}));
