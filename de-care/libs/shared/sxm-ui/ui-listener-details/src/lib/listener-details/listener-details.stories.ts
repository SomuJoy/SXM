import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SharedSxmUiUiListenerDetailsModule } from '../shared-sxm-ui-ui-listener-details.module';

const stories = storiesOf('Component Library/ui/Listener Details', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiListenerDetailsModule],
        })
    );

stories.add('New car', () => ({
    template: `
        <sxm-ui-listener-details [listenerData]="listenerData">
            <p>Radio ID: AC843A4Z</p><p>All Access Trial Ends: 12/15/2020</p>
        </sxm-ui-listener-details>
    `,
    props: {
        listenerData: {
            eyebrow: 'New car',
            title: '2020 Hyundai Elantra',
            icon: '#icon-car',
        },
    },
}));

stories.add('Subscription', () => ({
    template: `
        <sxm-ui-listener-details [listenerData]="listenerData">
            <p>2020 Hyundai Elantra</p><p>Monthly Plan Starts: 12/16/2020</p>
        </sxm-ui-listener-details>
    `,
    props: {
        listenerData: {
            eyebrow: 'Subscription',
            title: 'SiriusXM All Access',
        },
    },
}));

stories.add('Transfer Service', () => ({
    template: `
        <sxm-ui-listener-details [listenerData]="listenerData">
            <p>XM Select</p><p>Monthly Plan Expires: 09/14/2021</p>
        </sxm-ui-listener-details>
    `,
    props: {
        listenerData: {
            eyebrow: 'Transfer service from',
            title: '2015 Volkswagen Golf',
            footer: 'This car will be removed from your account.',
        },
    },
}));

stories.add('Port Subscription', () => ({
    template: `
        <sxm-ui-listener-details [listenerData]="listenerData">
            <p>Subscription Resumes: 10/23/2021 </p>
        </sxm-ui-listener-details>
    `,
    props: {
        listenerData: {
            eyebrow: 'Subscription After Trial',
            title: 'Platinum',
            footer: `We'll carry over any remaining days that you already paid for. Your next billing date is reflected below.`,
        },
    },
}));
