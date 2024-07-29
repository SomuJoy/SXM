import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as uuid from 'uuid/v4';
import { NG_VALUE_ACCESSOR, FormGroup, FormBuilder, ControlValueAccessor, Validators, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';

import { SettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';
import { SxmLanguages } from '@de-care/app-common';

export interface SxmUiPostalCodeFormWrapperApi {
    reset: () => void;
}

@Component({
    selector: 'sxm-ui-postal-code-form-wrapper',
    templateUrl: './postal-code-form-wrapper.component.html',
    styleUrls: ['./postal-code-form-wrapper.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SxmUiPostalCodeFormWrapperComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: SxmUiPostalCodeFormWrapperComponent,
            multi: true,
        },
    ],
})
export class SxmUiPostalCodeFormWrapperComponent implements ControlValueAccessor, OnInit, Validators, OnChanges {
    translateKeyPrefix = 'SharedSxmUiUiPostalCodeFormWrapperModule.SxmUiPostalCodeFormWrapperComponent.';
    controlId = uuid();
    currentLang: SxmLanguages;
    addressFormGroup: FormGroup;
    isCanada = false;
    @Input() errorMsg: string;
    @Input() set submitted(value: boolean) {
        value && this.addressFormGroup?.get('zip')?.markAllAsTouched();
    }
    @Input() labelText: string;
    @Input() invalidZipFromLookup = false;
    inputIsFocused = false;

    constructor(private readonly _formBuilder: FormBuilder, private _settings: SettingsService, private _translateService: TranslateService) {}

    reset() {
        this.addressFormGroup.reset();
    }

    ngOnInit(): void {
        const country = this._settings.settings.country;
        this.currentLang = this._translateService.currentLang as SxmLanguages;
        this.isCanada = country === 'ca';
        this.addressFormGroup = this._formBuilder.group({
            zip: [
                '',
                {
                    validators: getSxmValidator('zipCode', country, this.currentLang),
                    updateOn: 'blur',
                },
            ],
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.invalidZipFromLookup?.currentValue) {
            this.addressFormGroup?.get('zip')?.setErrors({ notValid: true });
        }
    }

    writeValue(val): void {
        if (val !== null && typeof val === 'object' && this._isEmpty(val)) {
            val = null;
        }
        val && this.addressFormGroup.patchValue(val, { emitEvent: false });
    }
    registerOnChange(fn): void {
        this.addressFormGroup.valueChanges.subscribe(fn);
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
    validate(c: AbstractControl): ValidationErrors | null {
        return this.addressFormGroup.valid ? null : { invalidForm: { valid: false, message: 'zip field is invalid' } };
    }
    private _isEmpty(obj): boolean {
        return Object.keys(obj).length === 0;
    }

    public onTouched: () => void = () => {
        // Do nothing
    };
}
