import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiContentCardModule } from '../shared-sxm-ui-ui-content-card.module';

const stories = storiesOf('Component Library/Atoms/Content Card', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiContentCardModule]
        })
    );

stories.add('with content', () => ({
    template: `
        <sxm-ui-content-card>
            <div htmlContentForBody>
                <p>Body content</p>
            </div>
        </sxm-ui-content-card>`
}));

stories.add('with headline and content', () => ({
    template: `
        <sxm-ui-content-card [headlinePresent]="true">
            <div htmlContentForHead>
                <p>Headline</p>
            </div>
            <div htmlContentForBody>
                <p>Body content</p>
            </div>
        </sxm-ui-content-card>`
}));

stories.add('with flag and content', () => ({
    template: `
        <sxm-ui-content-card [flagPresent]="true">
            <div htmlContentForFlag>
                <p>Flag</p>
            </div>
            <div htmlContentForBody>
                <p>Body content</p>
            </div>
        </sxm-ui-content-card>`
}));

stories.add('with flag and headline and content', () => ({
    template: `
        <sxm-ui-content-card [flagPresent]="true" [headlinePresent]="true">
            <div htmlContentForFlag>
                <p>Flag</p>
            </div>
            <div htmlContentForHead>
                <p>Headline</p>
            </div>
            <div htmlContentForBody>
                <p>Body content</p>
            </div>
        </sxm-ui-content-card>`
}));
