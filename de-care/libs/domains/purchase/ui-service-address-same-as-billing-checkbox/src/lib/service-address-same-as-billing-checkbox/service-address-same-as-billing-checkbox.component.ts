import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'service-address-same-as-billing-checkbox',
    templateUrl: './service-address-same-as-billing-checkbox.component.html',
    styleUrls: ['./service-address-same-as-billing-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ServiceAddressSameAsBillingCheckboxComponent,
            multi: true
        }
    ]
})
export class ServiceAddressSameAsBillingCheckboxComponent implements ControlValueAccessor {
    translateKey = 'domainsPurchaseUiServiceAddressSameAsBillingCheckboxModule.serviceAddressSameAsBillingCheckboxComponent';

    private _val = true;

    set value(val: boolean) {
        if (val !== undefined && this._val !== val) {
            if (val === null) {
                val = this._val;
            }
            this._val = val;
            this.onChange(val);
            this.onTouched(val);
        }
    }

    get value(): boolean {
        return this._val;
    }

    constructor() {}

    onTouched: any = () => {};
    onChange: any = () => {};

    writeValue(val: any): void {
        this.value = val;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
