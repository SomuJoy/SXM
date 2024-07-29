import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiYourCurrentPlanComponent, SxmUiYourCurrentPlanComponentModule } from './your-current-plan.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiYourCurrentPlanComponent;

const planData = {
    name: 'Platinum VIP Bundle',
    type: 'PROMO',
    termLength: 3,
    price: 24.99,
    fullPrice: 24.99,
    withoutFees: false,
    promoShowTotalPrice: false,
};

export default {
    title: 'Component Library/__uncatagorized__/YourCurrentPlanComponent',
    component: SxmUiYourCurrentPlanComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiYourCurrentPlanComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiYourCurrentPlanComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { args, planData },
    template: `<sxm-ui-your-current-plan [planData]="planData"></sxm-ui-your-current-plan>`,
});
