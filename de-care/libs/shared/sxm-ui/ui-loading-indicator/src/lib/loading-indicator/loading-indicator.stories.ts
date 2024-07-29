import { withA11y } from '@storybook/addon-a11y';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SxmLoadingIndicatorComponent } from './loading-indicator.component';
import { SxmLoadingIndicatorDirective } from './loading-indicator.directive';

const stories = storiesOf('shared/sxm-ui/loading-button', module)
    .addDecorator(withA11y)
    .addDecorator(moduleMetadata({ declarations: [SxmLoadingIndicatorComponent, SxmLoadingIndicatorDirective] }));

stories.addDecorator(withKnobs);

stories.add('default', () => ({
    template: `
        <button type="button" [sxm-loading-indicator]="isLoading">
            TestContent
        </button>
    `,
    props: {
        isLoading: boolean('isLoading', false)
    }
}));

stories.add('no styles', () => ({
    template: `
        <button class="button" type="button" [sxm-loading-indicator]="isLoading">
            TestContent
        </button>
    `,
    props: {
        isLoading: boolean('isLoading', false)
    }
}));
