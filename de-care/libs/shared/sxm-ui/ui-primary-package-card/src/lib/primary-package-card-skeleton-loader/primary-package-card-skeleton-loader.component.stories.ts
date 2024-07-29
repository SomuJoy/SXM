import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPrimaryPackageCardSkeletonLoaderComponent, SxmUiPrimaryPackageCardSkeletonLoaderComponentModule } from './primary-package-card-skeleton-loader.component';

type StoryType = SxmUiPrimaryPackageCardSkeletonLoaderComponent;

export default {
    title: 'Component Library/UI/PrimaryPackageCardSkeletonLoaderComponent',
    component: SxmUiPrimaryPackageCardSkeletonLoaderComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiPrimaryPackageCardSkeletonLoaderComponentModule],
        }),
    ],
} as Meta<SxmUiPrimaryPackageCardSkeletonLoaderComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-primary-package-card-skeleton-loader></sxm-ui-primary-package-card-skeleton-loader>`,
});

export const WithBoxShadow: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="width: 260px; margin-bottom: 24px; box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);">
            <sxm-ui-primary-package-card-skeleton-loader></sxm-ui-primary-package-card-skeleton-loader>
        </div>
    `,
});
