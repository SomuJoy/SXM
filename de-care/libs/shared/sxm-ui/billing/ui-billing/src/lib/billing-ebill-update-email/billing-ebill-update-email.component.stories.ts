import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiBillingEbillUpdateEmailComponentModule } from './billing-ebill-update-email.component';

const stories = storiesOf('Component Library/Billings/BillingEbillUpdateEmail', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiBillingEbillUpdateEmailComponentModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                {
                    provide: TRANSLATION_SETTINGS,
                    useValue: {
                        canToggleLanguage: true,
                        languagesSupported: ['en-US', 'en-CA', 'fr-CA'],
                    },
                },
            ],
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

const username = "testsiriusxm@siriusxm.com"

stories.add('default', () => ({
    template: `
            <sxm-ui-billing-ebill-update-email [email]="email" [loading]="false" [updateEmailServerError]="false" (updateEmailId)="onUpdateEmailId()" (updateEmailCancel)="onUpdateEmailCancel()"></sxm-ui-billing-ebill-update-email>
    `,
    moduleMetadata: {
        providers: [],
    },
    props: {
        updateEmailForm: new FormGroup({ email: new FormControl() }),
        email: username,
        onUpdateEmailCancel: action('@Output() onUpdateEmailCancel'),
        onUpdateEmailId: action('@Output() onUpdateEmailId'),
    },
}));

stories.add('update-email: in modal', () => ({
    template: `
        <sxm-ui-modal [closed]="false" title="Billing" [titlePresent]="true">
        <sxm-ui-billing-ebill-update-email [email]="email" [loading]="false" [updateEmailServerError]="false" (updateEmailId)="onUpdateEmailId()" (updateEmailCancel)="onUpdateEmailCancel()"></sxm-ui-billing-ebill-update-email>
        </sxm-ui-modal>
    `,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {
        updateEmailForm: new FormGroup({ email: new FormControl() }),
        email: username,
        onUpdateEmailCancel: action('@Output() onUpdateEmailCancel'),
        onUpdateEmailId: action('@Output() onUpdateEmailId'),
    },
}));

