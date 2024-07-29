import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiSubscriptionDetailsUiPromoSubscriptionDetailsModule } from './promo-subscription-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/SubscriptionDetails/PromoSubscriptionDetails', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionDetailsUiPromoSubscriptionDetailsModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const subData = {
    planName: ['Platinum'],
    term: 3,
    endDate: '2022-10-29T00:00:00-04:00',
    planUrl: '',
    followOnPlans: [{ planName: 'Music Showcase', term: 1, startDate: '2022-10-29T00:00:00-04:00', type: 'SELF_PAY' }],
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
        <sxm-ui-promo-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-promo-subscription-details>
    `,
    props: {
        data: { ...subData, followOnPlans: null },
        dropdownListData,
    },
}));

stories.add('with self-pay followOn', () => ({
    template: `
        <sxm-ui-promo-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-promo-subscription-details>
    `,
    props: {
        data: subData,
        dropdownListData,
    },
}));

stories.add('with promo followOn', () => ({
    template: `
        <sxm-ui-promo-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-promo-subscription-details>
    `,
    props: {
        data: { ...subData, followOnPlans: [{ planName: 'Platinum', term: 3, startDate: '2022-07-29T00:00:00-04:00', endDate: '2022-10-29T00:00:00-04:00', type: 'PROMO' }] },
        dropdownListData,
    },
}));

stories.add('promo followOn and selfpay followOn', () => ({
    template: `
        <sxm-ui-promo-subscription-details [data]="data" [dropdownListData]="dropdownListData"></sxm-ui-promo-subscription-details>
    `,
    props: {
        data: {
            ...subData,
            followOnPlans: [
                { planName: 'Platinum', term: 3, startDate: '2022-07-29T00:00:00-04:00', endDate: '2022-10-29T00:00:00-04:00', type: 'PROMO' },
                { planName: 'Music Showcase', term: 1, startDate: '2022-10-29T00:00:00-04:00', type: 'SELF_PAY' },
            ],
            hasPromoFollowOn: true,
        },
        dropdownListData,
    },
}));
