import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiPrimaryPackageCardPlaceholderComponent, SxmUiPrimaryPackageCardPlaceholderComponentModule } from './primary-package-card-placeholder.component';

type StoryType = SxmUiPrimaryPackageCardPlaceholderComponent;

export default {
    title: 'Component Library/UI/PrimaryPackageCardPlaceholderComponent',
    component: SxmUiPrimaryPackageCardPlaceholderComponent,
    decorators: [
        moduleMetadata({
            imports: [SxmUiPrimaryPackageCardPlaceholderComponentModule],
        }),
    ],
} as Meta<SxmUiPrimaryPackageCardPlaceholderComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: args,
    template: `<sxm-ui-primary-package-card-placeholder></sxm-ui-primary-package-card-placeholder>`,
});
