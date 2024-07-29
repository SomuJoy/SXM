import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-with-trialer-no-payment-due-with-followon',
    templateUrl: './billing-with-trialer-no-payment-due-with-followon.component.html',
    styleUrls: ['./billing-with-trialer-no-payment-due-with-followon.component.scss'],
})
export class SxmUiBillingWithTrialerNoPaymentDueWithFollowonComponent implements ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiBillingWithTrialerNoPaymentDueWithFollowonComponent],
    exports: [SxmUiBillingWithTrialerNoPaymentDueWithFollowonComponent],
    imports: [CommonModule, TranslateModule.forChild()],
})
export class SharedSxmUiBillingBillingWithTrialerNoPaymentDueWithFollowonModule {}
