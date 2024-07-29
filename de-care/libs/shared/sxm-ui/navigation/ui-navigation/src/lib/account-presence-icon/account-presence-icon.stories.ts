import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { SxmUiAccountPresenceIconModule } from './account-presence-icon.component';

const stories = storiesOf('Component Library/Navigation/AccountPresenceIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiAccountPresenceIconModule],
        })
    );

stories.add('default (on black background)', () => ({
    template: `
        <div style="background-color: black; padding: 12px; display: grid; justify-content: end">
            <sxm-ui-account-presence-icon [loggedIn]="loggedIn"></sxm-ui-account-presence-icon>
        </div>
    `,
    props: {
        loggedIn: boolean('loggedIn', false),
    },
}));
