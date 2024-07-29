import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiReadyToExploreComponent, SxmUiReadyToExploreComponentModule } from './ready-to-explore.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

type StoryType = SxmUiReadyToExploreComponent;

export default {
    title: 'Component Library/Navigation/Common CTA Navigation/ReadyToExploreComponent',
    component: SxmUiReadyToExploreComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiReadyToExploreComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiReadyToExploreComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-ready-to-explore></sxm-ui-ready-to-explore>`,
});

export const WithListenNowLink: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-ready-to-explore><a listenNowLink>Listen via the SXM App</a></sxm-ui-ready-to-explore>`,
});
