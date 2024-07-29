import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedSxmUiUiDealAddonCardModule } from '../shared-sxm-ui-ui-deal-addon-card.module';

const stories = storiesOf('Component Library/Ui/Deal Redemption Instructions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiDealAddonCardModule],
        })
    );
stories.addDecorator(withKnobs);

const sampleCopy = {
    title: '1 month of discovery+',
    productImage: 'assets/img/discovery_plus_16x9.png',
    descriptions: [
        'A redemption email with your unique code will be sent to the email address provided within 48 hours. Simply follow the instructions to start enjoying 1 month of discovery+.',
    ],
};

stories.add('default', () => ({
    template: `<sxm-ui-deal-redemption-instructions [copyContent]="copyContent"></sxm-ui-deal-redemption-instructions>`,
    props: { copyContent: sampleCopy },
}));

stories.add('width 375', () => ({
    template: `<div style="width: 375px;"><sxm-ui-deal-redemption-instructions [copyContent]="copyContent"></sxm-ui-deal-redemption-instructions></div>`,
    props: { copyContent: sampleCopy },
}));
