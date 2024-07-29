import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SharedSxmUiUiAddressPipeModule, SharedSxmUiUiPhonePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';

export interface ContactInfo {
    name: string;
    phone?: number | string;
    email?: string;
    address?: Address;
}

interface Address {
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
    selector: 'sxm-ui-contact-info-action',
    templateUrl: './contact-info-action.component.html',
    styleUrls: ['./contact-info-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiContactInfoActionComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() data: ContactInfo;
    @Output() editContactInfo = new EventEmitter();

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }
}

@NgModule({
    declarations: [SxmUiContactInfoActionComponent],
    exports: [SxmUiContactInfoActionComponent],
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiAddressPipeModule, SharedSxmUiUiPhonePipeModule],
})
export class SharedSxmUiContactInfoActionComponentModule {}
