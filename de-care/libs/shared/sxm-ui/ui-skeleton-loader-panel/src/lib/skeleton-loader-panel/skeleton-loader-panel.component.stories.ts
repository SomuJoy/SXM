import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiSkeletonLoaderPanelComponent, SxmUiSkeletonLoaderPanelComponentModule } from './skeleton-loader-panel.component';

type StoryType = SxmUiSkeletonLoaderPanelComponent;

export default {
    title: 'Component Library/Atoms/Skeleton Loader Panel',

    component: SxmUiSkeletonLoaderPanelComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiSkeletonLoaderPanelComponentModule],
        }),
    ],
} as Meta<SxmUiSkeletonLoaderPanelComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-skeleton-loader-panel style="height: 300px;"></sxm-ui-skeleton-loader-panel>`,
});

export const Multiple: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <sxm-ui-skeleton-loader-panel style="height: 60px;"></sxm-ui-skeleton-loader-panel>
        <br />
        <sxm-ui-skeleton-loader-panel style="height: 60px;"></sxm-ui-skeleton-loader-panel>
        <br />
        <sxm-ui-skeleton-loader-panel style="height: 60px;"></sxm-ui-skeleton-loader-panel>
    `,
});

export const WithText: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-skeleton-loader-panel style="height: 300px;">Loading some content</sxm-ui-skeleton-loader-panel>`,
});
