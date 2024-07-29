import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as uuid from 'uuid/v4';

// ===============================================================================
// Import Forms
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

export interface VerifyAddressData {
    correctedAddresses: any;
    currentAddress: any;
    headingText: string;
    addressCorrectionAction: number;
}
/**
 * @deprecated Use SxmUiVerifyAddressComponent from libs/shared/sxm-ui/ui-verify-address/src/lib/verify-address/verify-address.component
 */
@Component({
    selector: 'customer-verify-address', // tslint:disable-line component-selector
    templateUrl: './verify-address.component.html',
    styleUrls: ['./verify-address.component.scss'],
})
export class VerifyAddressComponent implements OnChanges {
    @Input() data: VerifyAddressData;
    @Input() ariaDescribedbyTextId = uuid();
    @Output() editAddress = new EventEmitter<any>();
    @Output() editExisting = new EventEmitter<any>();
    addressValidationForm: FormGroup;
    addressSelectionErrorMessage: boolean = false;

    constructor(private formBuilder: FormBuilder) {
        // TODO: DEX-4236 remove the use of the Form stuff from in here.
        this.addressValidationForm = this.formBuilder.group({
            addressValidation: new FormControl('', [Validators.required]),
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && changes.data.currentValue) {
            if (changes.data.currentValue.addressCorrectionAction === 0 && changes.data.currentValue.correctedAddresses) {
                if (changes.data.currentValue.correctedAddresses.length > 1) {
                    this.addressValidationForm.controls.addressValidation.setValue(['suggested_address', changes.data.currentValue.correctedAddresses]);
                } else {
                    this.addressValidationForm.controls.addressValidation.setValue(['suggested_address', changes.data.currentValue.correctedAddresses[0]]);
                }
            } else if (changes.data.currentValue.addressCorrectionAction === 2 && changes.data.currentValue.currentAddress) {
                this.addressValidationForm.controls.addressValidation.setValue(['original_address', changes.data.currentValue.currentAddress]);
            }
        }
    }

    onSubmit() {
        const replyAddy = this.addressValidationForm.value.addressValidation;
        if (replyAddy[0] === 'suggested_address') {
            if (Array.isArray(replyAddy[1]) && replyAddy[1].length !== 1) {
                this.addressSelectionErrorMessage = true;
                return;
            }
            this.editAddress.emit({ ...replyAddy[1] });
            return;
        }
        this.editAddress.emit(replyAddy[1]);
    }
}
