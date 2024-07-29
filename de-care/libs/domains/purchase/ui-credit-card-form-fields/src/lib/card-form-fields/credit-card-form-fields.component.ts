import { setFocusOnInputField, getCurrentDateMonthYear } from '@de-care/browser-common';
import { SettingsService } from '@de-care/settings';
import { SxmLanguages } from '@de-care/app-common';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { getSxmValidator, controlIsInvalid, getCreditCardExpiredValidator, buildCvvLengthValidator } from '@de-care/shared/validation';
import { FormBuilder, FormGroup, FormControl, AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validators, ValidationErrors } from '@angular/forms';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

export interface CreditCardFormFieldsComponentApi {
    clearForm: () => void;
    setFocus: () => void;
    ccName: AbstractControl;
}

@Component({
    selector: 'credit-card-form-fields',
    templateUrl: './credit-card-form-fields.component.html',
    styleUrls: ['./credit-card-form-fields.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CreditCardFormFieldsComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: CreditCardFormFieldsComponent,
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardFormFieldsComponent implements OnInit, OnDestroy, ControlValueAccessor, CreditCardFormFieldsComponentApi {
    get ccName() {
        return this.paymentForm?.controls.ccName;
    }

    constructor(private _formBuilder: FormBuilder, private _translateService: TranslateService, private _settingsService: SettingsService) {}
    @Input() ccError: boolean;
    @Input() serviceError: boolean;
    @Input() submitted = false;
    @Input() maskCreditCardNumber = false;
    @Input() maskedCCNum: string;
    @Output() unmask = new EventEmitter();
    @ViewChild('creditCardName') private _creditCardName: ElementRef;

    paymentForm: FormGroup;
    currentLang: SxmLanguages;
    isCVVEnabled = false;
    isGiftCardEntered: boolean = false;
    copyKey = 'domainsPurchaseUiCreditCardFormFieldsModule.creditCardFormFieldsComponent.';

    private destroy$: Subject<boolean> = new Subject<boolean>();

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    public onTouched: () => void = () => {};

    ngOnInit() {
        this._listenForLangChange();
        this._checkCVVEnabled();
        this._initForm();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    setFocus() {
        setFocusOnInputField(this._creditCardName);
    }

    clearForm() {
        this.paymentForm.reset();
    }

    writeValue(val: any): void {
        if (val !== null && typeof val === 'object' && this._isEmpty(val)) {
            val = null;
        }
        val && this.paymentForm.setValue(val, { emitEvent: false });
    }

    registerOnChange(fn: any): void {
        this.paymentForm.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    validate(c: AbstractControl): ValidationErrors | null {
        return this.paymentForm.valid && !this.isGiftCardEntered ? null : { invalidForm: { valid: false, message: 'credit card fields are invalid' } };
    }

    handleUnmaskCC(): void {
        this.unmask.emit();
    }

    checkGiftCardEntry($event): void {
        this.isGiftCardEntered = $event.isGiftCard;
    }

    private _isEmpty(obj): boolean {
        return Object.keys(obj).length === 0;
    }

    private _initForm(): void {
        this.paymentForm = this._formBuilder.group({
            ccName: new FormControl('', {
                updateOn: 'blur',
                validators: [Validators.required],
            }),
            ccNum: new FormControl('', {
                validators: [...getSxmValidator('creditCardNumber')],
                updateOn: 'blur',
            }),
            ccExpDate: new FormControl('', {
                validators: [...getSxmValidator('creditCardExpDate'), getCreditCardExpiredValidator(getCurrentDateMonthYear())],
                updateOn: 'blur',
            }),
        });
        if (this.isCVVEnabled) {
            this.paymentForm.addControl(
                'ccCVV',
                new FormControl('', {
                    validators: [...getSxmValidator('creditCardSecurityCode'), buildCvvLengthValidator(this.paymentForm.controls['ccNum'])],
                    updateOn: 'blur',
                })
            );
        }
        this._setFormLangValidators();
    }

    private _setFormLangValidators(updateValuesAndValidities: boolean = false): void {
        if (this.paymentForm.controls) {
            const ccNameField = this.paymentForm.controls.ccName;
            ccNameField.setValidators(getSxmValidator('creditCardName', this._settingsService.settings.country, this.currentLang));
            if (updateValuesAndValidities) {
                ccNameField.updateValueAndValidity();
            }
        }
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((ev) => {
            this.currentLang = ev.lang as SxmLanguages;
            this._setFormLangValidators(true);
        });
    }

    private _checkCVVEnabled(): void {
        this.isCVVEnabled = this._settingsService.isCVVEnabled;
    }
}
