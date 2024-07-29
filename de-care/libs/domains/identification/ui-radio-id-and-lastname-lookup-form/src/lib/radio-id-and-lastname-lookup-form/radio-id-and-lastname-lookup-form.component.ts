import { Component, OnInit, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getSxmValidator } from '@de-care/shared/validation';

export interface RadioIdAndLastnameLookupFormComponentApi {
    completedLookupSuccess(): void;
    completedLookupFail(): void;
    showSystemError(): void;
}

@Component({
    selector: 'radio-id-and-lastname-lookup-form',
    templateUrl: './radio-id-and-lastname-lookup-form.component.html',
    styleUrls: ['./radio-id-and-lastname-lookup-form.component.scss'],
})
export class RadioIdAndALastnameLookupFormComponent implements OnInit, AfterViewInit, RadioIdAndLastnameLookupFormComponentApi {
    translateKeyPrefix = 'DomainsIdentificationUiRadioIdAndLastnameLookupFormModule.RadioIdAndLastnameLookupFormComponent.';
    form: FormGroup;
    processing$ = new BehaviorSubject(false);
    isLookupError$ = new BehaviorSubject(false);
    isSystemError$ = new BehaviorSubject(false);
    @Input() lookupErrorTextCopy: string;
    @Output() radioIdAndLastnameReadyToProcess = new EventEmitter<{ radioId: string; lastName: string }>();

    constructor(private readonly _formBuilder: FormBuilder, private readonly _store: Store) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            radioId: ['', { validators: getSxmValidator('radioId'), updateOn: 'blur' }],
            lastName: ['', { validators: getSxmValidator('lastNameForLookup'), updateOn: 'blur' }],
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
            const { radioId, lastName } = this.form.value;
            this.radioIdAndLastnameReadyToProcess.next({ radioId, lastName });
        } else {
            const errors = [];
            if (this.form.controls.radioId.errors) {
                errors.push('Missing or invalid radio id');
            }
            if (this.form.controls.accountNumber.errors) {
                errors.push('Missing or invalid lastname');
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
