import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getSxmValidator } from '@de-care/shared/validation';

export interface RadioIdAndAccountNumberLookupFormComponentApi {
    completedLookupSuccess(): void;
    completedLookupFail(): void;
    showSystemError(): void;
}

@Component({
    selector: 'radio-id-and-account-number-lookup-form',
    templateUrl: './radio-id-and-account-number-lookup-form.component.html',
    styleUrls: ['./radio-id-and-account-number-lookup-form.component.scss']
})
export class RadioIdAndAccountNumberLookupFormComponent implements OnInit, AfterViewInit, RadioIdAndAccountNumberLookupFormComponentApi {
    translateKeyPrefix = 'DomainsIdentificationUiRadioIdAndAccountNumberLookupFormModule.RadioIdAndAccountNumberLookupFormComponent.';
    form: FormGroup;
    processing$ = new BehaviorSubject(false);
    isLookupError$ = new BehaviorSubject(false);
    isSystemError$ = new BehaviorSubject(false);
    @Input() lookupErrorTextCopy: string;
    @Output() radioIdAndAccountNumberReadyToProcess = new EventEmitter<{ radioId: string; accountNumber: string }>();

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            radioId: ['', { validators: getSxmValidator('radioId'), updateOn: 'blur' }],
            accountNumber: ['', { validators: getSxmValidator('accountNumber'), updateOn: 'blur' }]
        });
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onSubmit() {
        this.processing$.next(true);
        this.isLookupError$.next(false);
        this.isSystemError$.next(false);
        this.form.markAllAsTouched();
        if (this.form.valid) {
            const { radioId, accountNumber } = this.form.value;
            this.radioIdAndAccountNumberReadyToProcess.next({ radioId, accountNumber });
        } else {
            const errors = [];
            if (this.form.controls.radioId.errors) {
                errors.push('Missing or invalid radio id');
            }
            if (this.form.controls.accountNumber.errors) {
                errors.push('Missing or invalid account number');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.processing$.next(false);
        }
    }

    completedLookupSuccess(): void {
        this.processing$.next(false);
    }

    completedLookupFail(): void {
        this.isLookupError$.next(true);
        this.processing$.next(false);
    }

    showSystemError(): void {
        this.isSystemError$.next(true);
        this.processing$.next(false);
    }
}
