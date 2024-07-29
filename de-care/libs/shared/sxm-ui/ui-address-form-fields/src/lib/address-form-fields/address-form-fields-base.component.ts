import { OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy, Injectable, Directive } from '@angular/core';
import { ControlValueAccessor, Validator, FormGroup, FormBuilder, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
// TODO: move this out of shared so it can be imported with a short path and not result in a circular dependency
import { getSxmValidator, controlIsInvalid } from '@de-care/shared/forms-validation';
import { FrontEndErrorEnum } from '@de-care/data-layer';
import { SettingsService } from '@de-care/settings';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SxmLanguages } from '@de-care/app-common';
import * as uuid from 'uuid/v4';
import { setFocusOnInputField } from '@de-care/browser-common';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { behaviorEventErrorFromUserInteraction } from '@de-care/shared/state-behavior-events';

export interface SxmUiAddressComponentApi {
    setFocus: () => void;
    clearForm: () => void;
}

export interface AddressFormFields {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

type AddressType = 'billing' | 'service' | 'default';

@Directive()
@Injectable()
export class AddressFormFieldsBaseComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator, SxmUiAddressComponentApi {
    @Input() submitted = false;
    // TODO: remove the flag when all scenarios are fixed.
    @Input() reducedFields = false;
    @Input() addressType: AddressType = 'default';
    @Input() prefillData: { zipCode: string };
    @ViewChild('addressLine1Element') private _addressLine1Element: ElementRef;

    addressForm: FormGroup;
    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    currentLang: SxmLanguages;
    addressId = uuid();
    cityId = uuid();
    zipId = uuid();

    private _destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(private formBuilder: FormBuilder, private _store: Store, public settingsSrv: SettingsService, private translate: TranslateService) {}

    ngOnInit() {
        this.addressForm = this.formBuilder.group({
            addressLine1: [
                '',
                {
                    updateOn: 'blur',
                },
            ],
            city: [
                '',
                {
                    updateOn: 'blur',
                },
            ],
            state: [
                '',
                {
                    validators: [Validators.required],
                },
            ],
            zip: [
                this.prefillData?.zipCode,
                {
                    updateOn: 'blur',
                },
            ],
        });
        this.currentLang = this.translate.currentLang as SxmLanguages;
        this.setFormLangValidations();
        this.translate.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
            this.setFormLangValidations(true);
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges.submitted) {
            if (this.submitted && this.addressForm) {
                if (!this.addressForm.controls.city.valid) {
                    this._store.dispatch(
                        behaviorEventErrorFromUserInteraction({
                            message: FrontEndErrorEnum.CheckoutMissingCity,
                        })
                    );
                }
                if (!this.addressForm.controls.state.valid) {
                    this._store.dispatch(
                        behaviorEventErrorFromUserInteraction({
                            message: FrontEndErrorEnum.CheckoutMissingState,
                        })
                    );
                }
                if (!this.addressForm.controls.zip.valid) {
                    this._store.dispatch(
                        behaviorEventErrorFromUserInteraction({
                            message: FrontEndErrorEnum.CheckoutMissingZipCode,
                        })
                    );
                }
            }
        }
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    setFocus() {
        setFocusOnInputField(this._addressLine1Element);
    }

    clearForm() {
        this.addressForm.reset();
    }

    public onTouched: () => void = () => {};

    writeValue(val: any): void {
        if (val !== null && typeof val === 'object' && this._isEmpty(val)) {
            val = null;
        }
        val && this.addressForm.patchValue(val, { emitEvent: false });
    }
    registerOnChange(fn: any): void {
        this.addressForm?.valueChanges?.subscribe(fn);
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    validate(c: AbstractControl): ValidationErrors | null {
        return this.addressForm.valid ? null : { invalidForm: { valid: false, message: 'address fields are invalid' } };
    }

    private _isEmpty(obj): boolean {
        return Object.keys(obj).length === 0;
    }

    private setFormLangValidations(updateValuesAndValidities: boolean = false) {
        const addressLine1Field = this.addressForm.get('addressLine1');
        const cityField = this.addressForm.get('city');
        const zipCode = this.addressForm.get('zip');
        addressLine1Field.setValidators(getSxmValidator('address', this.settingsSrv.settings.country, this.currentLang));
        cityField.setValidators(getSxmValidator('city', this.settingsSrv.settings.country, this.currentLang));
        zipCode.setValidators(getSxmValidator('zipCode', this.settingsSrv.settings.country, this.currentLang));
        if (updateValuesAndValidities) {
            addressLine1Field.updateValueAndValidity();
            cityField.updateValueAndValidity();
            zipCode.updateValueAndValidity();
        }
    }
}
