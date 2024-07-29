import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataValidationService } from '@de-care/data-services';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { getSxmValidator, getValidatePasswordServerFn } from '@de-care/shared/validation';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

export interface Credentials {
    username: string;
    password: string;
}

@Component({
    selector: 'registration-credentials-step',
    templateUrl: './registration-credentials-step.component.html',
    styleUrls: ['./registration-credentials-step.component.scss'],
})
export class RegistrationCredentialsStepComponent implements OnInit, OnDestroy {
    translateKeyPrefix = 'DomainsAccountUiRegisterMultiStepModule.RegistrationCredentialsStepComponent.';
    form: FormGroup;
    submitted = false;
    processing$ = new BehaviorSubject(false);
    readonly passwordElementId = uuid();
    reservedWords: string[] = [];
    @Output() stepCompleted = new EventEmitter<Credentials>();
    @Input() showExistingError: boolean;
    @Input() showSystemError: boolean;
    @ViewChild('passwordComponentRef') private readonly _passwordComponentRef: SxmUiPasswordStrengthComponent;
    alwaysDisplayPasswordHint = false;
    private _unsubscribe$ = new Subject();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _dataValidationService: DataValidationService,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            username: [
                '',
                {
                    validators: getSxmValidator('registrationUserName'),
                    // TODO: Add server side validator
                    updateOn: 'blur',
                },
            ],
            password: [
                null,
                {
                    validators: getSxmValidator('password'),
                    asyncValidators: getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck()),
                },
            ],
        });
    }

    keyup() {
        this.showExistingError = false;
        this.showSystemError = false;
    }

    ngOnDestroy(): void {
        if (this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
        }
    }

    onSubmit() {
        this.form.markAllAsTouched();
        this.submitted = true;
        this.processing$.next(true);
        if (this.form.pending) {
            this.form.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    takeUntil(this._unsubscribe$)
                )
                .subscribe(() => {
                    this._validateAndComplete();
                });
        } else {
            this._validateAndComplete();
        }
    }

    private _validateAndComplete(): void {
        if (this.form.valid) {
            this.processing$.next(false);
            this.stepCompleted.next({
                username: this.form.value.username,
                password: this.form.value.password,
            });
        } else {
            const errors: string[] = [];
            if (this.form.controls.username.hasError('required')) {
                errors.push('Registration - Missing username/email');
            }
            if (this.form.controls.password.hasError('required')) {
                errors.push('Reset Pwd - Missing password');
            }
            // TODO: log remaining client side errors
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.processing$.next(false);
        }
    }

    mouseEnterOnContinueButton() {
        if (this._passwordComponentRef && this._passwordComponentRef.displayPasswordHint) {
            this.alwaysDisplayPasswordHint = true;
        }
    }

    mouseLeaveOnContinueButton() {
        this.alwaysDisplayPasswordHint = false;
    }
}
