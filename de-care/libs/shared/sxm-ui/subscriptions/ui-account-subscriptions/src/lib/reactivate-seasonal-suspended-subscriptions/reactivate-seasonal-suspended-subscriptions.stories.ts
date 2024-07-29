import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule } from './reactivate-seasonal-suspended-subscriptions.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { FormControl, FormGroup } from '@angular/forms';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/ReactivateSeasonalSuspendedSubscriptions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-reactivate-seasonal-suspended-subscriptions (userClosed)="closeActivateSeasonalSuspendedSubscriptionModal()"></sxm-ui-reactivate-seasonal-suspended-subscriptions>`,
    moduleMetadata: {
        providers: [],
    },
    props: {
        closeActivateSeasonalSuspendedSubscriptionModal: action('@Output() closeActivateSeasonalSuspendedSubscriptionModal'),
    },
}));

stories.add('reactivate-seasonal-suspended-subscriptions: in modal ', () => ({
    template: `
        <sxm-ui-modal [closed]="false" (modalClosed)="closeActivateSeasonalSuspendedSubscriptionModal()">
            <sxm-ui-reactivate-seasonal-suspended-subscriptions (userClosed)="closeActivateSeasonalSuspendedSubscriptionModal()">
            </sxm-ui-reactivate-seasonal-suspended-subscriptions>
        </sxm-ui-modal>`,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {
        form: new FormGroup({ letter: new FormControl() }),
        closeActivateSeasonalSuspendedSubscriptionModal: action('@Output() closeActivateSeasonalSuspendedSubscriptionModal'),
    },
}));
