import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule } from './remove-inactive-radio-form.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Full Forms/RemoveInactiveRadioForm', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule],
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
            <sxm-ui-remove-inactive-radio-form [loading]="false" [removeInactiveRadioServerError]="false" (userSelectedReason)="onUserSelectedReasonToRemoveInactiveRadio()" (userCancel)="onUserCancel()"></sxm-ui-remove-inactive-radio-form>
    `,
    moduleMetadata: {
        providers: [],
    },
    props: {
        form: new FormGroup({ letter: new FormControl() }),
        passedValue: [],
        onUserCancel: action('@Output() onUserCancel'),
        onUserSelectedReasonToRemoveInactiveRadio: action('@Output() onUserSelectedReasonToRemoveInactiveRadio'),
    },
}));

stories.add('reason-selector: in modal', () => ({
    template: `
        <sxm-ui-modal [closed]="false" title="Subscriptions" [titlePresent]="true">
            <sxm-ui-remove-inactive-radio-form [loading]="false" [removeInactiveRadioServerError]="false" (userSelectedReason)="onUserSelectedReasonToRemoveInactiveRadio()" (userCancel)="onUserCancel()"></sxm-ui-remove-inactive-radio-form>
        </sxm-ui-modal>
    `,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {
        form: new FormGroup({ letter: new FormControl() }),
        passedValue: [],
        reasonSelected: action('@Output() removeReasonSelected'),
        cancelClicked: action('@Output() userCancelClicked'),
    },
}));
