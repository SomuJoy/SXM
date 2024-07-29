import { SXM_UI_STORYBOOK_STORIES } from './sxm-ui.stories';
import { SxmUiBannerComponent } from '@de-care/sxm-ui';

SXM_UI_STORYBOOK_STORIES.add('banner', () => ({
    component: SxmUiBannerComponent,
    template: `
        <sxm-ui-banner>
            Banner Text
        </sxm-ui-banner>
    `
}));
