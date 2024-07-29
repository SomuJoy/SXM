import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiLegalCopyModule } from '../shared-sxm-ui-ui-legal-copy.module';

const stories = storiesOf('Component Library/ui/Legal Copy', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiLegalCopyModule]
        })
    );

stories.add('default', () => ({
    template: `<sxm-ui-legal-copy [legalCopy]="legalCopy"></sxm-ui-legal-copy>`,
    props: {
        legalCopy: '<p><strong>OFFER DETAILS</strong>: Your selected subscription package will begin immediately.</p>'
    }
}));

stories.add('multiple paragraphs', () => ({
    template: `<sxm-ui-legal-copy [legalCopy]="legalCopy"></sxm-ui-legal-copy>`,
    props: {
        legalCopy: '<p><strong>OFFER DETAILS</strong>: Your selected subscription package will begin immediately.</p><p>Fees and taxes apply.</p>'
    }
}));
