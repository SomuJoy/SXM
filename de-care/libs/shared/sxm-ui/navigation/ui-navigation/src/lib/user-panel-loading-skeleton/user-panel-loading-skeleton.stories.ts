import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SxmUiUserPanelLoadingSkeletonModule } from './user-panel-loading-skeleton.component';

const stories = storiesOf('Component Library/Navigation/UserPanelLoadingSkeleton', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiUserPanelLoadingSkeletonModule],
        })
    );

stories.add('default', () => ({
    template: `
        <sxm-ui-user-panel-loading-skeleton></sxm-ui-user-panel-loading-skeleton>
    `,
}));
