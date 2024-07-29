import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateStreamingCredentialsService } from '@de-care/domains/account/state-account';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
    selector: 'setup-login-credentials',
    templateUrl: './setup-login-credentials.component.html',
    styleUrls: ['./setup-login-credentials.component.scss'],
})
export class SetupLoginCredentialsComponent {
    @Input() radioId: string;
    @Input() hidePrivacyPolicyLink = false;
    @Input() submitButtonTextOverride: string;
    @Input() isNotStreamingAccountCreation: boolean;
    @Output() credentialsCreated = new EventEmitter();
    loginComplete = false;
    translateKeyPrefix = 'DomainsIdentificationUiSetupLoginCredentialsFormModule.SetupLoginCredentialsComponent.';
    reservedWords: string[];
    form: FormGroup;
    submitted = false;
    showSubmissionError = false;

    loading$ = new BehaviorSubject<boolean>(false);
    isMouseInSubmitButtonZone$ = new BehaviorSubject<'ENTERED' | 'LEFT'>('LEFT');
    clickedSubmitButton$ = new Subject<boolean>();

    constructor(private readonly _formBuilder: FormBuilder, private readonly _updateStreamingCredentialsService: UpdateStreamingCredentialsService) {
        this.form = this._formBuilder.group({
            credentials: {},
        });
    }

    private _checkFormControlsAndUpdateValidities() {
        Object.keys(this.form.controls).forEach((formControl) => {
            this.form.controls[formControl].updateValueAndValidity();
        });
    }

    onSubmitClick(): void {
        this.loading$.next(true);
        this.clickedSubmitButton$.next(true);
        this.form.markAllAsTouched();
        this.submitted = true;
        this.showSubmissionError = false;

        this._checkFormControlsAndUpdateValidities();

        if (this.isNotStreamingAccountCreation) {
            const formValue = this.form.value;
            this.credentialsCreated.emit({
                userName: formValue.username,
                password: formValue.password,
            });
            this.loading$.next(false);
        } else {
            if (this.form.status === 'PENDING') {
                this.form.statusChanges
                    .pipe(
                        filter((status) => status !== 'PENDING'),
                        take(1)
                    )
                    .subscribe(() => this._processCredentialsSubmission());
            } else {
                this._processCredentialsSubmission();
            }
        }
    }

    private _processCredentialsSubmission() {
        if (this.form.valid) {
            const formValue = this.form.value;
            this._updateStreamingCredentialsService
                .build({
                    radioId: this.radioId,
                    username: formValue.username,
                    password: formValue.password,
                })
                .subscribe({
                    next: () => {
                        this.credentialsCreated.emit(formValue.username);
                        this.loginComplete = true;
                        this.loading$.next(false);
                    },
                    error: () => {
                        this.loading$.next(false);
                        this.showSubmissionError = true;
                    },
                    complete: () => {
                        this.loading$.next(false);
                    },
                });
        } else {
            // dispatch behavior event user errors
            this.loading$.next(false);
        }
    }
}
