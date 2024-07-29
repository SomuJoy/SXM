import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SharedSxmUiUiAddressPipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-address-action',
    templateUrl: './billing-address-action.component.html',
    styleUrls: ['./billing-address-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiBillingAddressActionComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() address: Address;
    @Output() editBillingAddress = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiBillingAddressActionComponent],
    exports: [SxmUiBillingAddressActionComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiAddressPipeModule, SharedSxmUiUiDataClickTrackModule],
})
export class SharedSxmUiBillingAddressActionComponentModule {}
