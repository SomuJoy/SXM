import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SxmUiFeaturesListComponent, SxmUiFeaturesListComponentModule } from './features-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const packageData = {
    planName: 'SiriusXM Streaming Platinum',
    features: [
        '<b>Ad-free music</b> for every genre & decade plus artist-created channels',
        '<b>Original talk,</b> exclusive comedy, news from every angle',
        '<b>NFL, MLB®, NBA, NHL®, and NCAA® play-by-play,</b> NASCAR®, plus the biggest names in sports talk',
        '<b>2 Howard Stern channels,</b> including video',
        '<b>Create Pandora stations</b> based on artists',
        '<b>SiriusXM video library</b> of in-studio shows & performances',
        '<b>Popular podcast series SXM originals,</b> plus access to Stitcher Premium',
    ],
};

type StoryType = SxmUiFeaturesListComponent;

export default {
    title: 'Component Library/ui/Features list',
    component: SxmUiFeaturesListComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiFeaturesListComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<StoryType>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    template: `<sxm-ui-features-list [data]="packageData"></sxm-ui-features-list>`,
    props: {
        packageData,
    },
});
