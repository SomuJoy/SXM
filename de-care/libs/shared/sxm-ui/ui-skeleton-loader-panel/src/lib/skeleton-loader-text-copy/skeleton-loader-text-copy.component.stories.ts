import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiSkeletonLoaderTextCopyComponent, SxmUiSkeletonLoaderTextCopyComponentModule } from './skeleton-loader-text-copy.component';

type StoryType = SxmUiSkeletonLoaderTextCopyComponent;

export default {
    title: 'Component Library/Atoms/Skeleton Loader Text Copy',
    component: SxmUiSkeletonLoaderTextCopyComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiSkeletonLoaderTextCopyComponentModule],
        }),
    ],
} as Meta<SxmUiSkeletonLoaderTextCopyComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-skeleton-loader-text-copy></sxm-ui-skeleton-loader-text-copy>`,
});

export const InOffWhitePanel: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="background-color: #f5f5f5; max-width: 300px; padding: 16px;">
            <sxm-ui-skeleton-loader-text-copy></sxm-ui-skeleton-loader-text-copy>
        <div>
    `,
});

export const InOffWhitePanelWithAnimationOverPanel: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="background-color: #f5f5f5; max-width: 300px;">
            <sxm-ui-skeleton-loader-text-copy style="padding: 16px;"></sxm-ui-skeleton-loader-text-copy>
        <div>
    `,
});
