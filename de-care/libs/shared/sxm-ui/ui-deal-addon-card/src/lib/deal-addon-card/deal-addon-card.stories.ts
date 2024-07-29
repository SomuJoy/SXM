import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedSxmUiUiDealAddonCardModule } from '../shared-sxm-ui-ui-deal-addon-card.module';

const stories = storiesOf('Component Library/Ui/Deal Addon Card', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiDealAddonCardModule]
        })
    );
stories.addDecorator(withKnobs);

stories.add('Amazon echo Dot', () => ({
    template: `
            <sxm-ui-deal-addon-card [copyContent]="copyContent">
            </sxm-ui-deal-addon-card>
        `,
    props: {
        copyContent: [
            {
                marketingCallout: 'Amazon echo Dot Included',
                title: '<b>Receive an Echo Dot (4th generation) on us.</b>',
                partnerImage: 'assets/img/device-echodot-gen4.png',
                productImage: 'assets/img/promo-deal-amazon-lead-offer-logo_4gen.png',
                description: `<div><ul><li>Enjoy SiriusXM in your home with Alexa</li><li>Tune to channels using just your voice</li></ul></div>`,
                toggleCollapsed: 'Explore plan details',
                toggleExpanded: 'Hide'
            }
        ]
    }
}));

stories.add('Hulu', () => ({
    template: `
            <sxm-ui-deal-addon-card [copyContent]="copyContent">
            </sxm-ui-deal-addon-card>
        `,
    props: {
        copyContent: [
            {
                marketingCallout: 'Plus Hulu',
                title: '6 months of Hulu',
                partnerImage: 'https://siriusxm.com/content/dam/sxm-com/qa/slam/promo-deal-hulu.png',
                productImage: '',
                description: `
                    <ul><li>Buzz-worthy Hulu Original Series and Movies like The Handmaid’s Tale, Palm Springs and Little Fires Everywhere</li>
                    <li>Exclusive new FX on Hulu shows</li>
                    <li>All the TV you love</li></ul>
                    <p><b>Already a Hulu Subscriber?</b><br />
                    You won’t be eligible for the free trial of Hulu, but continue and you’ll still get 6 months of SiriusXM Select for $40.</p>
                `,
                shownDescription: `<p>Enjoy a huge streaming library of current hits, full seasons, movies and much more with Hulu’s ad-supported plan.</p>
                <p>Redeem at Hulu. <b>See Offer Details.</b></p>`,
                toggleCollapsed: 'Explore plan details',
                toggleExpanded: 'Hide'
            }
        ]
    }
}));

stories.add('megawinback, multiple deal entries', () => ({
    template: `
            <sxm-ui-deal-addon-card [copyContent]="copyContent">
            </sxm-ui-deal-addon-card>
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
                toggleExpanded: 'Hide'
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
                toggleExpanded: 'Hide'
            }
        ]
    }
}));
