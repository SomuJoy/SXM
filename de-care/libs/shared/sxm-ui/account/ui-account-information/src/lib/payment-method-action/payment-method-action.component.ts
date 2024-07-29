import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

interface PaymentMethodModel {
    type: string;
    creditCard?: string;
    lastFourDigits?: number;
    expMonth?: number;
    expYear?: number;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-payment-method-action',
    templateUrl: './payment-method-action.component.html',
    styleUrls: ['./payment-method-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPaymentMethodActionComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() paymentMethod: PaymentMethodModel;
    @Output() editPaymentMethod = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiPaymentMethodActionComponent],
    exports: [SxmUiPaymentMethodActionComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule],
})
export class SharedSxmUiPaymentMethodActionComponentModule {}
