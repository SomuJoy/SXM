import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { number, withKnobs } from '@storybook/addon-knobs';
import { SxmUiAlertsIconModule } from './alerts-icon.component';

const stories = storiesOf('Component Library/Navigation/AlertsIcon', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiAlertsIconModule],
        })
    );

stories.add('default (on black background)', () => ({
    template: `
        <div style="background-color: black; padding: 12px; display: grid; justify-content: end">
            <sxm-ui-alerts-icon [alertCount]="alertCount"></sxm-ui-alerts-icon>
        </div>
    `,
    props: {
        alertCount: number('alertCount', 0),
    },
}));
