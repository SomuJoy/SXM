import { withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiAlertPillModule } from '../shared-sxm-ui-ui-alert-pill.module';
import { TranslateModule } from '@ngx-translate/core';

const stories = storiesOf('Component Library/Atoms/AlertPill', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiAlertPillModule],
        })
    )
    .addDecorator(withTranslation)
    .addDecorator(withMockSettings);

stories.add('default', () => ({
    template: `
        <sxm-ui-alert-pill>A new code has been sent.</sxm-ui-alert-pill>
    `,
}));

stories.add('long text', () => ({
    template: `
        <sxm-ui-alert-pill>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </sxm-ui-alert-pill>
    `,
}));

stories.add('different background color', () => ({
    template: `
        <sxm-ui-alert-pill style="background-color: pink;">
            change the background color
        </sxm-ui-alert-pill>
    `,
}));

stories.add('with notification icon', () => ({
    template: `
        <sxm-ui-alert-pill class="alert-icon-notification">
            notification
        </sxm-ui-alert-pill>
    `,
}));

stories.add('with info icon', () => ({
    template: `
        <sxm-ui-alert-pill class="alert-icon-info">
            info
        </sxm-ui-alert-pill>
    `,
}));

stories.add('with rounded corners', () => ({
    template: `
        <div style="background-color: #0000eb; padding: 25px;">
            <sxm-ui-alert-pill class="rounded-corners">
                notification
            </sxm-ui-alert-pill>
        </div>
    `,
}));

stories.add('with straight corner', () => ({
    template: `
        <sxm-ui-alert-pill class="alert-icon-info straight-corners">
            info
        </sxm-ui-alert-pill>
    `,
}));

stories.add('with bold-text', () => ({
    template: `
        <sxm-ui-alert-pill class="bold-text">
            notification
        </sxm-ui-alert-pill>
    `,
}));

stories.add('with no-shadow', () => ({
    template: `
        <sxm-ui-alert-pill class="no-shadow">
            notification
        </sxm-ui-alert-pill>
    `,
}));

stories.add('black notification', () => ({
    template: `
        <sxm-ui-alert-pill class="black-alert-icon-notification">
            notification
        </sxm-ui-alert-pill>
    `,
}));

stories.add('critical info', () => ({
    template: `
        <sxm-ui-alert-pill class="critical-alert-icon-info">
            notification
        </sxm-ui-alert-pill>
    `,
}));

stories.add('with error icon', () => ({
    template: `
        <sxm-ui-alert-pill class="alert-icon-error">
            error
        </sxm-ui-alert-pill>
    `,
}));