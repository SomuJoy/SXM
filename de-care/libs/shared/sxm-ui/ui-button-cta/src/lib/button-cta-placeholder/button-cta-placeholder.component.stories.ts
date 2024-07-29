import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiButtonCtaPlaceholderComponent, SxmUiButtonCtaPlaceholderComponentModule } from './button-cta-placeholder.component';

type StoryType = SxmUiButtonCtaPlaceholderComponent;

export default {
    title: 'Component Library/Buttons/ButtonCtaPlaceholderComponent',
    component: SxmUiButtonCtaPlaceholderComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiButtonCtaPlaceholderComponentModule],
        }),
    ],
} as Meta<SxmUiButtonCtaPlaceholderComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-button-cta-placeholder></sxm-ui-button-cta-placeholder>`,
});
