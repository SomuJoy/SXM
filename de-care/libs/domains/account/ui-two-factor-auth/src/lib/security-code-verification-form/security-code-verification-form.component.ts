import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { minMaxNumberValidator } from '@de-care/shared/validation';

export interface SecurityCodeVerificationFormComponentApi {
    reset(): void;
}

@Component({
    selector: 'security-code-verification-form',
    templateUrl: './security-code-verification-form.component.html',
    styleUrls: ['./security-code-verification-form.component.scss']
})
export class SecurityCodeVerificationFormComponent implements OnInit, SecurityCodeVerificationFormComponentApi {
    @Input() processing = false;
    @Input() errorMsg: string | null;
    @Input() resendCodeLinkText: string;
    @Input() showResendLink = true;
    @Input() showChatWithAgentLink = false;
    @Output() securityCodeSubmitted = new EventEmitter<number>();
    @Output() resendCodeRequest = new EventEmitter();
    translateKeyPrefix = 'domainsAccountUiTwoFactorAuth.securityCodeVerificationFormComponent';
    form: FormGroup;
    constructor(private readonly _formBuilder: FormBuilder) {}

    ngOnInit() {
        this.form = this._formBuilder.group(
            {
                securityCode: ['', [Validators.required, minMaxNumberValidator(6, 6)]]
            },
            { updateOn: 'blur' }
        );
    }

    onSubmit() {
        // TODO: figure out what we can do to wrap this logic up somewhere to make things always behave like this by default
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.securityCodeSubmitted.emit(this.form.value.securityCode);
        }
    }

    reset(): void {
        this.form.reset();
    }
}
