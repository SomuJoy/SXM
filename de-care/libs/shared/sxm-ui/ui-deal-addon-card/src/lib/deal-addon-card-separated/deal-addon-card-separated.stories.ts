import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedSxmUiUiDealAddonCardModule } from '../shared-sxm-ui-ui-deal-addon-card.module';

const stories = storiesOf('Component Library/Ui/Deal Addon Card Separated', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiDealAddonCardModule],
        })
    );
stories.addDecorator(withKnobs);

stories.add('megawinback, multiple deal entries', () => ({
    template: `
            <sxm-ui-deal-addon-card-separated [copyContent]="copyContent">
            </sxm-ui-deal-addon-card-separated>
        `,
    props: {
        copyContent: [
            {
                marketingCallout: '<p>12-MONTH UPGRADE</p><p>+ A FREE ECHO DOT</p>',
                title: '<b>CMS mock test: Your free upgrade includes:</b>',
                partnerImage: '',
                productImage: '',
                description: `
                    <div>
                    <ul><li><b>CMS mock test:</b> Two dedicated Howard Stern channels, including video</li><li>Ability to create Pandora Stations</li><li>Every NFL game and NASCAR® race</li></ul>
                    </div>
                `,
                moreDescription: '',
                toggleCollapsed: 'Explore plan details',
                toggleExpanded: 'Hide',
            },
            {
                marketingCallout: '<p>12-MONTH UPGRADE</p><p>+ A FREE ECHO DOT</p>',
                title: '<b>CMS mock test: Receive a free Amazon Echo Dot (4rd generation).</b>',
                partnerImage: 'assets/img/device-echodot-gen4.png',
                productImage: 'assets/img/promo-deal-amazon-lead-offer-logo_4gen.png',
                description: `
                    <div>
                        <ul>
                            <li><b>CMS mock test: Subject to Amazon’s inventory, please allow up to 8 weeks for delivery.</b></li>
                            <li>Enjoy SiriusXM in your home with Amazon Alexa.</li>
                            <li>Tune to channels using your voice.</li>
                        </ul>
                    </div>
                `,
                moreDescription: '',
                toggleCollapsed: 'Explore plan details',
                toggleExpanded: 'Hide',
            },
        ],
    },
}));
