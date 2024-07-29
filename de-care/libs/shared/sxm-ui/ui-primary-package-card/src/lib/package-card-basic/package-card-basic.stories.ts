import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SxmUiPackageCardBasicComponentModule } from './package-card-basic.component';

const stories = storiesOf('Component Library/ui/Package Card Basic', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiPackageCardBasicComponentModule],
        })
    );

const packageData = {
    platformPlan: 'SiriusXM Streaming Platinum',
    priceAndTermDescTitle: '<span data-duration>12 months</span> for <span data-price>$99</span><span data-incentive-text>Save 25% &bull; Cancel online anytime</span>',
    processingFeeDisclaimer: 'Then $10.99/mo. plus taxes &amp; fees. <strong>Offer Details</strong> below.',
};

stories.add('default', () => ({
    template: ` <sxm-ui-package-card-basic [packageData]="packageData"></sxm-ui-package-card-basic>`,
    props: {
        packageData,
    },
}));
