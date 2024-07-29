import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionDetailsUiTrialSubscriptionDetailsModule } from './trial-subscription-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/SubscriptionDetails/TrialSubscriptionDetails', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionDetailsUiTrialSubscriptionDetailsModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    planName: ['Platinum'],
    term: 3,
    endDate: '2022-09-29T00:00:00-04:00',
    planUrl: '',
    followOnPlans: [{ planName: 'Music & Entertainment', startDate: '2022-09-29T00:00:00-04:00', term: 6, type: 'SELF_PAY' }],
    hasPromoFollowon: false,
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
        <sxm-ui-trial-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-trial-subscription-details>
    `,
    props: {
        data: { ...subData, followOnPlans: null },
        dropdownListData,
    },
}));

stories.add('with self-pay followOn', () => ({
    template: `
        <sxm-ui-trial-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-trial-subscription-details>
    `,
    props: {
        data: subData,
        dropdownListData,
    },
}));

stories.add('with promo followOn', () => ({
    template: `
        <sxm-ui-trial-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-trial-subscription-details>
    `,
    props: {
        data: {
            ...subData,
            followOnPlans: [{ planName: 'Music & Entertainment', startDate: '2022-07-29T00:00:00-04:00', endDate: '2022-09-29T00:00:00-04:00', term: 3, type: 'PROMO' }],
        },
        dropdownListData,
    },
}));

stories.add('multiyear term', () => ({
    template: `
        <sxm-ui-trial-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-trial-subscription-details>
    `,
    props: {
        data: { ...subData, term: 24, endDate: '2024-05-01T00:00:00-04:00' },
        dropdownListData,
    },
}));

stories.add('multiple plannames', () => ({
    template: `
        <sxm-ui-trial-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-trial-subscription-details>
    `,
    props: {
        data: { ...subData, planName: ['Travel Link', 'Traffic'] },
        dropdownListData,
    },
}));

stories.add('promo followOn, selfpay followOn', () => ({
    template: `
        <sxm-ui-trial-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-trial-subscription-details>
    `,
    props: {
        data: {
            ...subData,
            hasPromoFollowOn: true,
            followOnPlans: [
                { planName: 'Music & Entertainment', startDate: '2022-07-29T00:00:00-04:00', endDate: '2022-10-29T00:00:00-04:00', term: 3, type: 'PROMO' },
                { planName: 'Music Showcase ', startDate: '2022-10-29T00:00:00-04:00', term: 6, type: 'SELF_PAY' },
            ],
        },
        dropdownListData,
    },
}));
