import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

export interface FlepzData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}

export interface StreamingFlepzLookupFormComponentApi {
    completedProcessing(): void;
    showSystemError(): void;
}

@Component({
    selector: 'streaming-flepz-lookup-form',
    templateUrl: './streaming-flepz-lookup-form.component.html',
    styleUrls: ['./streaming-flepz-lookup-form.component.scss'],
})
export class StreamingFlepzLookupFormComponent implements OnInit, AfterViewInit, StreamingFlepzLookupFormComponentApi {
    @Input() isInvalidEmailErrorsToForm = false;
    @Input() isInvalidFirstNameErrorsToForm = false;
    translateKeyPrefix = 'DomainsIdentityUiStreamingFlepzLookupFormModule.StreamingFlepzLookupFormComponent.';
    @Output() signInRequested = new EventEmitter();
    @Output() flepzDataReadyToProcess = new EventEmitter<FlepzData>();
    form: FormGroup;
    submitInitiated = false;
    showSystemError$ = new BehaviorSubject(false);
    processingSubmission$ = new BehaviorSubject(false);

    constructor(private readonly _store: Store, private readonly _formBuilder: FormBuilder) {}

    completedProcessing(): void {
        this.processingSubmission$.next(false);
    }
    showSystemError(): void {
        this.showSystemError$.next(true);
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            flepz: this._formBuilder.control(''),
        });
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'flepz' }));
    }

    onFormSubmit() {
        this.submitInitiated = true;
        this.showSystemError$.next(false);
        this.isInvalidFirstNameErrorsToForm = false;
        this.isInvalidEmailErrorsToForm = false;
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.processingSubmission$.next(true);
            this.flepzDataReadyToProcess.emit(this.form.value.flepz);
        }
    }
}
