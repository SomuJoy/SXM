import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';

export const SXM_UI_STORYBOOK_STORIES = storiesOf('sxm-ui', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SxmUiModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withMockSettings);

SXM_UI_STORYBOOK_STORIES.add('card-with-cta: oem subscribe', () => ({
    template: `
        <sxm-ui-card-with-cta [title]="title" [buttonCopy]="buttonCopy" [buttonClass]="buttonClass">
            <p subCardCopy class="legal-copy">You can read our <strong>Customer Agreement</strong> and <strong>Privacy Policy</strong> at siriusxm.com/agreements.</p>
        </sxm-ui-card-with-cta>`,
    props: {
        title: 'Please call SiriusXM to subscribe.',
        buttonCopy: 'Call <strong>1-855-607-7523</strong> to Subscribe',
        buttonClass: 'secondary',
    },
}));

SXM_UI_STORYBOOK_STORIES.add('card-with-cta: oem manage account', () => ({
    template: `
        <sxm-ui-card-with-cta [title]="title" [buttonCopy]="buttonCopy" [buttonClass]="buttonClass">
            <p subCardCopy class="legal-copy">You can read our <strong>Customer Agreement</strong> and <strong>Privacy Policy</strong> at siriusxm.com/agreements.</p>
        </sxm-ui-card-with-cta>`,
    props: {
        title: 'Please call SiriusXM to manage your account.',
        buttonCopy: 'Call <strong>1-855-607-7523</strong> to Manage',
        buttonClass: 'secondary',
    },
}));

SXM_UI_STORYBOOK_STORIES.add('card-with-cta: oem confirmation', () => ({
    template: `
        <sxm-ui-card-with-cta [title]="title" [buttonCopy]="buttonCopy">
            <p cardCopy>Your Customer Agreement will be sent to you as a link in your confirmation email.</p>
            <p subCardCopy class="legal-copy">Your subscription starts on the date indicated on the prior Order
             Summary screen. The subscription plan you chose will automatically renew thereafter and be charged
             to the card on file at then-current rates plus fees and taxes. You have agreed to the SiriusXM Customer
             Agreement at siriusxm.com/agreements, including the refund policy, and how to cancel, which includes
             calling us at 1-866-635-2349. The Customer Agreement will remain legally binding unless you cancel your
             subscription within 7 days after it begins. If you would like to receive a copy of the Customer Agreement
             by mail, you can call 1-866-635-2349.</p>
        </sxm-ui-card-with-cta>`,
    props: {
        title: `Congratulations! You're all set`,
        buttonCopy: 'done',
    },
}));

SXM_UI_STORYBOOK_STORIES.add('expiration date field', () => ({
    template: `
    <div class="input-container">
        <label for="ccExpDate">Expiration Date (MM/YY)</label>
        <input
            appMaskExpirationDate
            type="text"
            id="ccExpDate"
            minlength="5"
            maxlength="5"
            onFocus
            required
        />
    </div>`,
}));

SXM_UI_STORYBOOK_STORIES.add('tool-tip', () => ({
    template: `
        <br /><br /><br />
        <sxm-ui-tooltip>
            <p>
                You have a previously unpaid balance on your account and this balance must be satisfied before you can complete
                your transaction.
            </p>
        </sxm-ui-tooltip>
    `,
    props: {},
}));

SXM_UI_STORYBOOK_STORIES.add('show-hide', () => ({
    template: `
        <sxm-ui-show-hide
            [expandedText]="expandedText"
            [collapsedText]="collapsedText"
            [opened]="opened">
            <p><b>SXM Select Includes:</b></p>
            <ul>
            <li>140+ channels</li>
            <li>85 ad-free music channels</li>
        </ul>
        </sxm-ui-show-hide>`,
    props: {
        expandedText: text('expandedText', 'See less'),
        collapsedText: text('collapsedText', 'See more'),
        opened: boolean('opened', false),
    },
}));
