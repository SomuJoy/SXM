import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiQuoteSkeletonComponent, SxmUiQuoteSkeletonComponentModule } from './quote-skeleton.component';
import { withKnobs, text } from '@storybook/addon-knobs';

type StoryType = SxmUiQuoteSkeletonComponent;

export default {
    title: 'Component Library/Quotes/QuoteSkeletonComponent',
    component: SxmUiQuoteSkeletonComponent,
    decorators: [
        withKnobs,
        moduleMetadata({
            imports: [SxmUiQuoteSkeletonComponentModule],
        }),
    ],
} as Meta<SxmUiQuoteSkeletonComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, title: text('@Input() title', 'Title for skeleton panel') },
    template: `<sxm-ui-quote-skeleton [title]="title"></sxm-ui-quote-skeleton>`,
});
