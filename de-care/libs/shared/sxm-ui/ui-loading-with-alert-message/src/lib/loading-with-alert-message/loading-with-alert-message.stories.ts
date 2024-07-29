import { withKnobs, boolean } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '../shared-sxm-ui-ui-loading-with-alert-message.module';

const stories = storiesOf('shared/sxm-ui/loading-with-alert-message', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(moduleMetadata({ imports: [SharedSxmUiUiLoadingWithAlertMessageModule] }));

stories.add('default', () => ({
    template: `
        <sxm-ui-loading-with-alert-message 
            [isLoading] = "isLoading"
            [paragraphs] = "
            ['Sorry, it looks like the offer is not longer available',
             '<strong>Finding another<br>great plan for you.</strong>']"
        > </sxm-ui-loading-with-alert-message>
    `,
    props: {
        isLoading: boolean('isLoading', true)
    }
}));
