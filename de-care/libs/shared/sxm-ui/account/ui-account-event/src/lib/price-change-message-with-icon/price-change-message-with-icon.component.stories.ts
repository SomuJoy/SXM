import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPriceChangeMessageWithIconComponent, SxmUiPriceChangeMessageWithIconComponentModule } from './price-change-message-with-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiPriceChangeMessageWithIconComponent;

export default {
    title: 'Component Library/Account/PriceChangeMessageWithIconComponent',
    component: SxmUiPriceChangeMessageWithIconComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiPriceChangeMessageWithIconComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiPriceChangeMessageWithIconComponent>;

const priceChangeData = {
    date: '03/14/2023',
    url: 'https://www.siriusxm.com/mar2023rates',
};

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: {
        ...args,
        data: priceChangeData,
    },
    template: `<sxm-ui-price-change-message-with-icon [data]="data"></sxm-ui-price-change-message-with-icon>`,
});
