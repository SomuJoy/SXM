import { Component, OnInit } from '@angular/core';
import { AddressFormFields, AddressFormFieldsBaseComponent } from '../address-form-fields-base.component';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';

export interface AddressFormFieldsOemComponentApi {
    setFocus: () => void;
    clearForm: () => void;
    getFormData: () => AddressFormFieldsOem;
}

export interface AddressFormFieldsOem extends AddressFormFields {
    addressLine2: string;
}

@Component({
    selector: 'sxm-ui-address-form-fields-oem',
    templateUrl: './address-form-fields-oem.component.html',
    styleUrls: ['./address-form-fields-oem.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AddressFormFieldsOemComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: AddressFormFieldsOemComponent,
            multi: true
        }
    ]
})
export class AddressFormFieldsOemComponent extends AddressFormFieldsBaseComponent implements AddressFormFieldsOemComponentApi, OnInit {
    translateKey = 'sharedSxmUiUiAddressFormFieldsModule.addressFormFieldsOemComponent';
    ngOnInit() {
        super.ngOnInit();
        this.addressForm.addControl(
            'addressLine2',
            new FormControl('', {
                validators: [...getSxmValidator('optionalAddress', this.settingsSrv.settings.country, this.currentLang)],
                updateOn: 'blur'
            })
        );
        this.addressForm.removeControl('state');
        this.addressForm.addControl('state', new FormControl('', { updateOn: 'blur', validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)] }));
    }

    getFormData(): AddressFormFieldsOem {
        return {
            addressLine1: this.addressForm.value.addressLine1,
            addressLine2: this.addressForm.value.addressLine2,
            city: this.addressForm.value.city,
            state: this.addressForm.value.state,
            zip: this.addressForm.value.zip
        };
    }
}
