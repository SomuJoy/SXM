import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';
import { SharedSxmUiUiAddressPipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { ComponentLocale, ComponentWithLocale, LanguageResources, ModuleWithTranslation, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';

interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
}
export interface VerifyAddressData {
    correctedAddresses: Address[];
    currentAddress: Address;
    headingText: string;
    addressCorrectionAction: number;
}
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-verify-address',
    templateUrl: './verify-address.component.html',
    styleUrls: ['./verify-address.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiVerifyAddressComponent implements ComponentWithLocale, OnChanges {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    form: FormGroup;
    addressSelectionErrorMessage = false;
    @Input() data: VerifyAddressData;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() useAddress = new EventEmitter<Address>();
    @Output() editExisting = new EventEmitter();
    @ViewChild('verifyAddressHeader') private readonly _verifyAddressHeader: ElementRef;

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _formBuilder: FormBuilder,
        private readonly _scrollService: ScrollService
    ) {
        translationsForComponentService.init(this);

        this.form = this._formBuilder.group({
            address: [null, Validators.required],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.reset({
            address: null,
        });
        if (changes?.data?.currentValue) {
            if (changes.data.currentValue.addressCorrectionAction === 2 && changes.data.currentValue.currentAddress) {
                this.form.controls.address.setValue(0);
            }
        }
    }

    onSubmit() {
        this.addressSelectionErrorMessage = false;
        const replyAddy = this.form.value.address;
        if (replyAddy === -1 || replyAddy === undefined || replyAddy === null) {
            this.addressSelectionErrorMessage = true;
            this._scrollService.scrollToElement(this._verifyAddressHeader.nativeElement);
            return;
        } else {
            if (replyAddy === 0) {
                this.useAddress.emit(this.data.currentAddress);
            } else {
                this.useAddress.emit(this.data.correctedAddresses[replyAddy - 1]);
            }
        }
    }
}

@NgModule({
    declarations: [SxmUiVerifyAddressComponent],
    exports: [SxmUiVerifyAddressComponent],
    imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule, SharedSxmUiUiRadioOptionFormFieldModule, SharedSxmUiUiAddressPipeModule],
})
export class SxmUiVerifyAddressComponentModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./messages.en-CA.json') },
            'en-US': { ...require('./messages.en-US.json') },
            'fr-CA': { ...require('./messages.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
