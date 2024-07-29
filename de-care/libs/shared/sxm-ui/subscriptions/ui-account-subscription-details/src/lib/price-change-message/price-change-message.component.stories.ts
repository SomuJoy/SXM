import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPriceChangeMessageComponent, SxmUiPriceChangeMessageComponentModule } from './price-change-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiPriceChangeMessageComponent;

export default {
    title: 'Component Library/SubscriptionDetails/PriceChangeMessageComponent',
    component: SxmUiPriceChangeMessageComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiPriceChangeMessageComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPriceChangeMessageComponent>;

const priceChangeData = {
    date: '03/14/2023',
    url: 'https://www.siriusxm.com/mar2023rates',
    price: 1,
};

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        data: priceChangeData,
    },
    template: `<sxm-ui-price-change-message [data]="data"></sxm-ui-price-change-message>`,
});
