import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiBillingEbillSignUpComponentModule } from './billing-ebill-sign-up.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Billings/BillingEbillSignUp', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiBillingEbillSignUpComponentModule],
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

stories.add('default', () => ({
    template: `
            <sxm-ui-billing-ebill-sign-up [loading]="false" [signUpEBillServerError]="false" (signUpEmailId)="onSignUpEmailId()" (signupCancel)="onSignupCancel()"></sxm-ui-billing-ebill-sign-up>
    `,
    moduleMetadata: {
        providers: [],
    },
    props: {
        signUpEBillForm: new FormGroup({ email: new FormControl() }),
        passedValue: [],
        onSignupCancel: action('@Output() onSignupCancel'),
        onSignUpEmailId: action('@Output() onSignUpEmailId'),
    },
}));

stories.add('signup-for-ebill: in modal', () => ({
    template: `
        <sxm-ui-modal [closed]="false" title="Billing" [titlePresent]="true">
        <sxm-ui-billing-ebill-sign-up [loading]="false" [signUpEBillServerError]="false" (signUpEmailId)="onSignUpEmailId()" (signupCancel)="onSignupCancel()"></sxm-ui-billing-ebill-sign-up>
        </sxm-ui-modal>
    `,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {
        signUpEBillForm: new FormGroup({ email: new FormControl() }),
        passedValue: [],
        onSignupCancel: action('@Output() onSignupCancel'),
        onSignUpEmailId: action('@Output() onSignUpEmailId'),
    },
}));

