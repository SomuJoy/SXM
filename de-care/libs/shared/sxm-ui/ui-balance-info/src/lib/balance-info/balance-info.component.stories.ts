import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiBalanceInfoComponent, SharedSxmUiBalanceInfoComponentModule } from './balance-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiBalanceInfoComponent;

export default {
    title: 'Component Library/payment/BalanceInfoComponent',
    component: SxmUiBalanceInfoComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBalanceInfoComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiBalanceInfoComponent>;

export const Default: Story<StoryType> = () => ({
    props: { data: { currentBalanceDue: 41.91, nextPaymentAmount: null, nextPaymentDueDate: null, totalAmountDue: null, reactivationAmount: 0 } },
    template: `<sxm-ui-balance-info [balanceDataValues]="data"></sxm-ui-balance-info>`,
});

export const CurrentPlusNext: Story<StoryType> = () => ({
    props: { data: { currentBalanceDue: 41.11, nextPaymentAmount: 23.99, nextPaymentDueDate: '5/24/2022', totalAmountDue: null, reactivationAmount: 0 } },
    template: `<sxm-ui-balance-info [balanceDataValues]="data"></sxm-ui-balance-info>`,
});
