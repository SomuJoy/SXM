import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SxmLanguages } from '@de-care/app-common';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { getCountry, getIsCanadaMode } from '@de-care/shared/state-settings';
import { EmailAsyncValidator } from '@de-care/shared/async-validators/state-email-verification';
import { getSxmValidator } from '@de-care/shared/validation';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'de-care-sl2c-form',
    templateUrl: './sl2c-form.component.html',
    styleUrls: ['./sl2c-form.component.scss'],
})
export class Sl2cFormComponent implements OnInit, OnDestroy, OnChanges {
    @Input() loading = false;
    @Input() vin;
    @Input() correctedAddress;
    @Output() formSubmit = new EventEmitter<any>();
    @ViewChild('helpFindingRadioModal') helpRadioVinModal;

    newAccountForm: FormGroup;
    translateKeyPrefix = 'deCareUseCasesTrialActivationUiSl2cForm.sl2cFormComponent';
    currentLang: SxmLanguages;
    radioIdVinId = 'sl2cRadioVinId';
    firstNameId = 'sl2cFirstNameId';
    lastNameId = 'sl2cLastNameId';
    emailId = 'sl2cEmailId';
    phoneNumberId = 'sl2cPhoneNumberId';
    isCanadaMode$ = this._store.pipe(select(getIsCanadaMode));
    deviceHelpModalAriaDescribedbyTextId = uuid();

    submitted = false;

    isCanada = false;
    agreementAccepted = false;
    agreement: FormControl;
    readonly contestMessageId = uuid();

    private readonly _unsubscribe$: Subject<void> = new Subject<void>();

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store, private readonly _emailAsyncValidator: EmailAsyncValidator) {}

    ngOnInit(): void {
        combineLatest([this._store.pipe(select(getCountry)), this._store.pipe(select(getLanguage))])
            .pipe(take(1), takeUntil(this._unsubscribe$))
            .subscribe(([country, currentLanguage]) => this._newAccountFormInit(country, currentLanguage));
    }

    ngOnChanges(changes: SimpleChanges) {
        const newAddress = changes?.correctedAddress?.currentValue;
        if (newAddress) {
            this.newAccountForm.patchValue(
                {
                    accountAddress: newAddress,
                },
                { emitEvent: false }
            );
        }
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    private _newAccountFormInit(country, currentLanguage) {
        if (country === 'ca') {
            this.isCanada = true;
        }
        this.newAccountForm = this._formBuilder.group({
            radioIdOrVin: [this.vin, { validators: getSxmValidator('radioIdOrVin'), updateOn: 'blur' }],
            firstName: ['', { validators: getSxmValidator('firstName', country, currentLanguage), updateOn: 'blur' }],
            lastName: ['', { validators: getSxmValidator('lastName', country, currentLanguage), updateOn: 'blur' }],
            phoneNumber: ['', { validators: getSxmValidator('optionalPhoneNumber'), updateOn: 'blur' }],
            email: [
                '',
                {
                    validators: getSxmValidator('optionalEmail', country, currentLanguage),
                    asyncValidators: this._emailAsyncValidator.getValidator(),
                    updateOn: 'blur',
                },
            ],
            accountAddress: ['', Validators.required],
        });
        if (this.isCanada) {
            this._addAgreementControl();
        }
    }

    private _addAgreementControl(): void {
        this.agreement = new FormControl(null, { validators: [Validators.required] });
        this.newAccountForm.addControl('agreement', this.agreement);
        this.agreement.valueChanges.pipe(takeUntil(this._unsubscribe$)).subscribe((checked) => {
            this.agreementAccepted = !!checked;
            if (checked === false) {
                this.newAccountForm.get('agreement').reset();
            }
        });
    }

    tooltipIconClicked(): void {
        this.helpRadioVinModal.open();
    }

    private _submitValidForm() {
        if (this.newAccountForm.valid) {
            this.formSubmit.emit(this.newAccountForm.value);
        }
    }

    submitClicked() {
        this.submitted = true;

        this.newAccountForm.markAllAsTouched();

        if (this.newAccountForm.pending) {
            // Note: There is only one async validator (email). If additional ones are added, we need to check more than one occurrence
            this.newAccountForm.statusChanges.pipe(take(1), takeUntil(this._unsubscribe$)).subscribe(() => {
                this._submitValidForm();
            });
        } else {
            this._submitValidForm();
        }
    }
}
