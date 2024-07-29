import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { AddressFormFieldsBaseComponent } from './address-form-fields-base.component';

@Component({
    selector: 'sxm-ui-address-form-fields',
    templateUrl: './address-form-fields.component.html',
    styleUrls: ['./address-form-fields.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AddressFormFieldsComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: AddressFormFieldsComponent,
            multi: true,
        },
    ],
})
export class AddressFormFieldsComponent extends AddressFormFieldsBaseComponent {
    get stateIsInvalid() {
        return this.controlIsInvalid(this.addressForm.get('state'));
    }
    translateKey = 'sharedSxmUiUiAddressFormFieldsModule.addressFormFieldsComponent';
}
