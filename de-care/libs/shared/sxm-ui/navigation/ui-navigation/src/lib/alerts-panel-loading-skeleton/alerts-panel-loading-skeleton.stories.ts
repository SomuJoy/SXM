import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SxmUiAlertsPanelLoadingSkeletonModule } from './alerts-panel-loading-skeleton.component';

const stories = storiesOf('Component Library/Navigation/AlertsPanelLoadingSkeleton', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiAlertsPanelLoadingSkeletonModule],
        })
    );

stories.add('default', () => ({
    template: `
        <sxm-ui-alerts-panel-loading-skeleton></sxm-ui-alerts-panel-loading-skeleton>
    `,
}));
