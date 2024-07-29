import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { behaviorEventErrorsFromUserInteraction, behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CreatePasswordWorkflowErrors, CreatePasswordWorkflowService } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { ActivatedRoute, Router } from '@angular/router';
import { SxmUiPasswordStrengthComponent } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { getSxmValidator, getValidatePasswordServerFn } from '@de-care/shared/validation';
import * as uuid from 'uuid/v4';
import { DataValidationService } from '@de-care/data-services';

@Component({
    selector: 'de-care-create-password-page',
    templateUrl: './create-password-page.component.html',
    styleUrls: ['./create-password-page.component.scss'],
})
export class CreatePasswordPageComponent implements AfterViewInit, OnInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.CreatePasswordPageComponent.';
    passwordForm: FormGroup;
    processing$ = new BehaviorSubject(false);
    @ViewChild('passwordControl') private _passwordFormField: SxmUiPasswordStrengthComponent;
    readonly passwordElementId = uuid();
    alwaysDisplayPasswordHint = false;
    showSystemError$ = new BehaviorSubject(false);
    showExpiredTokenError$ = new BehaviorSubject(false);
    showInvalidTokenError$ = new BehaviorSubject(false);
    submitted = false;
    reservedWords: string[] = [];

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _createPasswordWorkflowService: CreatePasswordWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private _dataValidationService: DataValidationService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.passwordForm = this._formBuilder.group({
            password: [
                null,
                {
                    validators: getSxmValidator('password'),
                    asyncValidators: getValidatePasswordServerFn(this._dataValidationService, () => this._changeDetectorRef.markForCheck()),
                },
            ],
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onSubmit() {
        this.passwordForm.markAllAsTouched();
        this.submitted = true;
        this.processing$.next(true);
        this.showSystemError$.next(false);
        this.showExpiredTokenError$.next(false);
        this.showInvalidTokenError$.next(false);
        if (this.passwordForm.valid) {
            this._createPasswordWorkflowService.build(this.passwordForm.value.password).subscribe({
                next: () => {
                    this._router.navigate(['./completed'], { relativeTo: this._activatedRoute }).then(() => {
                        this.processing$.next(false);
                    });
                },
                error: (error: CreatePasswordWorkflowErrors) => {
                    if (error === 'SYSTEM') {
                        this.showSystemError$.next(true);
                    } else if (error === 'INVALID_PASSWORD_RESET_TOKEN') {
                        this.showInvalidTokenError$.next(true);
                    } else if (error === 'EXPIRED_PASSWORD_RESET_TOKEN') {
                        this.showExpiredTokenError$.next(true);
                    }
                    this.processing$.next(false);
                },
            });
        } else {
            const errors = [];
            const passwordControl = this.passwordForm.controls.password;
            // TODO: check with Launch team to see if we can change these to not have Registration text in them (use something like Streaming Credentials)
            if (passwordControl.hasError('required')) {
                errors.push('Registration - Missing password');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors: [''] }));
            this.processing$.next(false);
        }
    }

    mouseEnterOnContinueButton() {
        if (this._passwordFormField && this._passwordFormField.displayPasswordHint) {
            this.alwaysDisplayPasswordHint = true;
        }
    }

    mouseLeaveOnContinueButton() {
        this.alwaysDisplayPasswordHint = false;
    }
}
