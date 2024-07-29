import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiButtonCtaSkeletonLoaderComponent, SxmUiButtonCtaSkeletonLoaderComponentModule } from './button-cta-skeleton-loader.component';

type StoryType = SxmUiButtonCtaSkeletonLoaderComponent;

export default {
    title: 'Component Library/Buttons/ButtonCtaSkeletonLoaderComponent',
    component: SxmUiButtonCtaSkeletonLoaderComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiButtonCtaSkeletonLoaderComponentModule],
        }),
    ],
} as Meta<SxmUiButtonCtaSkeletonLoaderComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-button-cta-skeleton-loader></sxm-ui-button-cta-skeleton-loader>`,
});
