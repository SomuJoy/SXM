import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import * as uuid from 'uuid/v4';
import { takeUntil } from 'rxjs/operators';
import { sxmCountries } from '@de-care/shared/state-settings';
import { Store } from '@ngrx/store';
import { getIncludeActivationInstructions } from '@de-care/de-care-use-cases/trial-activation/state-legacy';

export interface AccountFormStepValue {
    email?: string;
    password: string;
}

@Component({
    selector: 'account-form-step',
    templateUrl: './account-form-step.component.html',
    styleUrls: ['./account-form-step.component.scss'],
})
export class AccountFormStepComponent implements OnInit, OnDestroy {
    @Input() username: string;
    @Input() submitted: boolean = false;
    @Input() isLoading: boolean = false;
    @Output() accountFormSubmit = new EventEmitter<AccountFormStepValue>();
    @Input() country: sxmCountries = 'us';

    accountForm: FormGroup;
    passwordControlName = 'password';
    agreementAccepted = false;
    agreement: FormControl;
    private _destroy$ = new Subject<boolean>();
    readonly contestMessageId = uuid();
    isCanada: boolean;
    includeActivationInstructions$ = this._store.select(getIncludeActivationInstructions);

    constructor(private _formBuilder: FormBuilder, private readonly _store: Store) {}

    ngOnInit(): void {
        this.isCanada = this.country === 'ca';
        this.accountForm = this._formBuilder.group({});
        if (this.isCanada) {
            this._addAgreementControl();
        }
    }

    sendForm(): void {
        this.submitted = true;
        if (this.accountForm.valid) {
            const formValue = this.accountForm.value as AccountFormStepValue;
            this.accountFormSubmit.emit(formValue);
        }
    }

    private _addAgreementControl(): void {
        this.agreement = new FormControl(null, { validators: [Validators.required] });
        this.accountForm.addControl('agreement', this.agreement);
        this.agreement.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((checked) => {
            this.agreementAccepted = !!checked;
            if (checked === false) {
                this.accountForm.get('agreement').reset();
            }
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
