import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SxmLoadingOverlayComponent } from './loading-overlay.component';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';

const stories = storiesOf('shared/sxm-ui/loading-overlay', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(moduleMetadata({ imports: [SharedSxmUiUiLoadingIndicatorModule], declarations: [SxmLoadingOverlayComponent] }));

stories.add('default', () => ({
    template: `
        <sxm-ui-loading-overlay [isLoading]="isLoading">
            <div [innerHTML]="'Finding another <br/> great offer for you.'" class="text-center align-justify full-width"></div>
        </sxm-ui-loading-overlay>
    `,
    props: {
        isLoading: boolean('isLoading', false)
    }
}));
