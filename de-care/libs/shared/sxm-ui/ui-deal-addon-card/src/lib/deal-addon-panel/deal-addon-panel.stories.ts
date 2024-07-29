import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedSxmUiUiDealAddonCardModule } from '../shared-sxm-ui-ui-deal-addon-card.module';

const stories = storiesOf('Component Library/Ui/Deal Addon Panel', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiDealAddonCardModule],
        })
    );
stories.addDecorator(withKnobs);

const sampleCopy = {
    title: 'Plus, 1 month of discovery+ on us. <sub>discovery+ eligibility and terms apply.</sub>',
    productImage: 'assets/img/discovery_plus_16x9.png',
    description: `
                <div>
                    <ul>
                        <li>Exclusive discovery+ Originals — can’t miss, exciting new series you won’t see anywhere else</li>
                        <li>All 60,000+ episodes and 2,500+ shows — more added all the time</li>
                        <li>Full access to watch anytime, anywhere on your mobile device, tablet, computer, game console and connected TV</li>
                    </ul>
                </div>
            `,
};

stories.add('default', () => ({
    template: `<sxm-ui-deal-addon-panel [copyContent]="copyContent"></sxm-ui-deal-addon-panel>`,
    props: { copyContent: sampleCopy },
}));

stories.add('width 375', () => ({
    template: `<div style="width: 375px;"><sxm-ui-deal-addon-panel [copyContent]="copyContent"></sxm-ui-deal-addon-panel></div>`,
    props: { copyContent: sampleCopy },
}));
