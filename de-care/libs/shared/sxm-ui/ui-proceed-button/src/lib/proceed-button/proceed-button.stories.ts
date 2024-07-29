import { withA11y } from '@storybook/addon-a11y';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SxmProceedButtonComponent } from './proceed-button.component';

const stories = storiesOf('Component Library/Buttons/ProceedButton', module)
    .addDecorator(withA11y)
    .addDecorator(
        moduleMetadata({
            declarations: [SxmProceedButtonComponent],
        })
    );

stories.addDecorator(withKnobs);

stories.add('Default Button View', () => ({
    template: `
        <button sxm-proceed-button>
            Continue Text
        </button>
    `,
}));

stories.add('Secondary', () => ({
    template: `
        <button sxm-proceed-button [secondary]="true">
            Continue Text
        </button>
    `,
}));

stories.add('Button With Loader', () => ({
    template: `
        <button [loading]="loading" sxm-proceed-button>
            Continue Text
        </button>
    `,
    props: {
        loading: boolean('isLoading', true),
    },
}));

stories.add('Button With/Without Full Width', () => ({
    template: `
        <button [fullWidth]="fullWidth" sxm-proceed-button>
            Continue Text
        </button>
    `,
    props: {
        fullWidth: boolean('fullWidth', false),
    },
}));
