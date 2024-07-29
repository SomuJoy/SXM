import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { CancelReasonComponent } from './cancel-reason/cancel-reason.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BillingTermFormComponent } from './billing-term-form/billing-term-form.component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SharedSxmUiUiIconCloseModule } from '@de-care/shared/sxm-ui/ui-icon-close';

const DECLARATIONS = [CancelReasonComponent, BillingTermFormComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiModule, ReactiveFormsModule, DomainsSubscriptionsUiPlayerAppIntegrationModule, SharedSxmUiUiIconCloseModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DomainsCancellationUiCancelModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/ui-cancel.en-CA.json'),
            'en-US': require('./i18n/ui-cancel.en-US.json'),
            'fr-CA': require('./i18n/ui-cancel.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
