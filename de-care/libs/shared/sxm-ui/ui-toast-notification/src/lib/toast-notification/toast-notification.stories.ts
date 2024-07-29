import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiUiToastNotificationModule } from './toast-notification.component';

const stories = storiesOf('Component Library/Toast Notification', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiToastNotificationModule],
        })
    );

stories.add('default', () => ({
    template: `
        <sxm-ui-toast-notification (finished)="onFinished()">Test Message</sxm-ui-toast-notification>
    `,
    props: {
        onFinished: action('Finished'),
    },
}));
