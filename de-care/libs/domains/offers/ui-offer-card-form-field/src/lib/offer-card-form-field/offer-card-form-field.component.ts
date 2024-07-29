import { ControlValueAccessorConnector } from '@de-care/shared/forms/util-cva-connector';
import { Component, Input, Output, EventEmitter, Injector } from '@angular/core';
import { OfferInfo } from '@de-care/domains/offers/ui-offer-description';
import * as uuid from 'uuid/v4';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PackageDescriptionModel } from '@de-care/domains/offers/state-package-descriptions';

@Component({
    selector: 'offer-card-form-field',
    templateUrl: './offer-card-form-field.component.html',
    styleUrls: ['./offer-card-form-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: OfferCardFormFieldComponent,
            multi: true
        }
    ]
})
export class OfferCardFormFieldComponent extends ControlValueAccessorConnector {
    @Input() planCode: string;
    @Input() flagPresent: boolean = false;
    @Input() headlinePresent: boolean = false;
    @Input() isCurrentPackage: boolean = false;
    @Input() offerInfo: OfferInfo;
    @Input() packageDescription: PackageDescriptionModel;
    @Input() isAddingPackage = false;
    @Output() packageClicked = new EventEmitter<void>();

    inputID = uuid();
    translationKeyPrefix = 'domainsOffersUIOfferCardFormFieldModule.offerCardFormFieldComponent.';

    constructor(injector: Injector) {
        super(injector);
    }
}
