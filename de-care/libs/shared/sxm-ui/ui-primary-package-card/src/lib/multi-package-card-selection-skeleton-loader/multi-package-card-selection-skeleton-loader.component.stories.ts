import { moduleMetadata, Story, Meta } from '@storybook/angular';
import {
    SxmUiMultiPackageCardSelectionSkeletonLoaderComponent,
    SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule,
} from './multi-package-card-selection-skeleton-loader.component';

type StoryType = SxmUiMultiPackageCardSelectionSkeletonLoaderComponent;

export default {
    title: 'Component Library/UI/MultiPackageCardSelectionSkeletonLoaderComponent',
    component: SxmUiMultiPackageCardSelectionSkeletonLoaderComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule],
        }),
    ],
} as Meta<SxmUiMultiPackageCardSelectionSkeletonLoaderComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-multi-package-card-selection-skeleton-loader></sxm-ui-multi-package-card-selection-skeleton-loader>`,
});

export const WithBoxShadow: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `
        <div style="width: 260px; margin-bottom: 24px; box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);">
            <sxm-ui-multi-package-card-selection-skeleton-loader></sxm-ui-multi-package-card-selection-skeleton-loader>
        </div>
    `,
});
