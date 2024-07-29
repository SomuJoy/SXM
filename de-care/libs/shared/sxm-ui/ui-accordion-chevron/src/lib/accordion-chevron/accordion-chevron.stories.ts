import { SharedSxmUiUiAccordionChevronModule } from '../shared-sxm-ui-ui-accordion-chevron.module';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { text, boolean } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const stories = storiesOf('Component Library/Containers/AccordionChevron', module).addDecorator(
    moduleMetadata({
        imports: [BrowserAnimationsModule, SharedSxmUiUiAccordionChevronModule],
    })
);

stories.add('accordion-chevron', () => ({
    template: `
        <sxm-ui-accordion-chevron
            [expandedText]="expandedText"
            [collapsedText]="collapsedText"
            [opened]="opened">
            <p><b>SXM Select Includes:</b></p>
            <ul>
            <li>140+ channels</li>
            <li>85 ad-free music channels</li>
        </ul>
        </sxm-ui-accordion-chevron>`,
    props: {
        expandedText: text('expandedText', 'See less'),
        collapsedText: text('collapsedText', 'See more'),
        opened: boolean('opened', false),
        aria: { expandedText: 'Explore plan details  - select', collapsedText: 'Explore plan details  - select' },
    },
}));
