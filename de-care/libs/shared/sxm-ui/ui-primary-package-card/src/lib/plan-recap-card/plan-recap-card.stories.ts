import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiPrimaryPackageCardModule } from '../shared-sxm-ui-ui-primary-package-card.module';

const stories = storiesOf('Component Library/ui/Plan Recap Card', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiPrimaryPackageCardModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withTranslation);

const data = {
    platformAndPlanName: 'SiriusXM Platinum',
    channelCount: '300',
    description: '$5.99/mo. Then $14.99/mo.',
};

stories.add('default', () => ({
    template: ` <sxm-ui-plan-recap-card [data]="data"></sxm-ui-plan-recap-card>`,
    props: {
        data,
    },
}));

stories.add('with fee text', () => ({
    template: ` <sxm-ui-plan-recap-card [data]="data"></sxm-ui-plan-recap-card>`,
    props: {
        data: { ...data, description: '$5.99/mo. Then $14.99/mo. plus fees' },
    },
}));

stories.add('when plan price is free and term length is 1', () => ({
    template: ` <sxm-ui-plan-recap-card [data]="data"></sxm-ui-plan-recap-card>`,
    props: {
        data: { ...data, description: '1 Month for Free. Then $14.99/mo.' },
    },
}));

stories.add('when plan price is free and term length is greater than 1', () => ({
    template: ` <sxm-ui-plan-recap-card [data]="data"></sxm-ui-plan-recap-card>`,
    props: {
        data: { ...data, description: '6 Months for Free. Then $14.99/mo.' },
    },
}));
