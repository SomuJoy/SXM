import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import * as uuid from 'uuid/v4';
import { DataAccountManagementService } from '@de-care/data-services';
import { behaviorEventErrorFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';

export class DoNotCallSubmitResultModel {
    status: 'success' | 'error';
    phoneNumber?: string;
    error?: any;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'do-not-call-form',
    templateUrl: './do-not-call-form.component.html',
    styleUrls: ['./do-not-call-form.component.scss']
})
export class DoNotCallFormComponent implements OnInit {
    @Output() doNotCallPhoneSubmit: EventEmitter<DoNotCallSubmitResultModel> = new EventEmitter<DoNotCallSubmitResultModel>();
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;
    phoneId = uuid();
    submittedPhone: string;
    dncForm: FormGroup;
    submitted = false;
    isLoading = false;
    hasCaptcha = false;
    captchaAnswerWrong = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _accountManagementService: DataAccountManagementService,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly _store: Store
    ) {}

    ngOnInit() {
        this.dncForm = this.buildForm();
    }

    submitForm(): void {
        this.isLoading = true;
        this.submitted = true;
        this.captchaAnswerWrong = false;
        if (this.dncForm.valid) {
            // call service
            this.submittedPhone = this.dncForm.value.phoneNumber;
            const params = {
                phoneNumber: this.dncForm.value.phoneNumber,
                ...(this.hasCaptcha && { answer: this.dncForm.value.nucaptcha.answer, token: this._nucaptchaComponent.getCaptchaToken() })
            };
            this._accountManagementService.donotcall(params).subscribe(
                result => {
                    if (result.resultCode === 'Success') {
                        this.doNotCallPhoneSubmit.emit({ status: 'success', phoneNumber: this.submittedPhone });
                    } else {
                        this.doNotCallPhoneSubmit.emit({ status: 'error' });
                    }
                },
                error => {
                    if (this.hasCaptcha && error.status === 400) {
                        // set up another captcha
                        this.isLoading = false;
                        this.submitted = false;
                        this.captchaAnswerWrong = true;
                        this._changeDetectorRef.markForCheck();
                    } else {
                        this.doNotCallPhoneSubmit.emit({ status: 'error', error: error.error });
                    }
                }
            );
        } else {
            this.isLoading = false;
            if (this.dncForm.get('phoneNumber').errors) {
                this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Do Not Call - Missing or invalid phone number' }));
            }
            // TODO: Captcha analytics?
        }
    }

    gotCaptcha(val): void {
        this.hasCaptcha = val;
        this.hasCaptcha ? this.dncForm.controls.nucaptcha.setValidators(Validators.required) : this.dncForm.controls.nucaptcha.setValidators(null);
        this.dncForm.controls.nucaptcha.reset();
    }

    private buildForm(): FormGroup {
        return this._formBuilder.group({
            phoneNumber: this._formBuilder.control('', {
                updateOn: 'blur',
                validators: getSxmValidator('phoneNumber')
            }),
            nucaptcha: this._formBuilder.control('')
        });
    }
}
