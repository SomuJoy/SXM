import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailAsyncValidator } from '@de-care/shared/async-validators/state-email-verification';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { TranslateModule } from '@ngx-translate/core';
import * as uuid from 'uuid/v4';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-billing-ebill-sign-up',
    templateUrl: './billing-ebill-sign-up.component.html',
    styleUrls: ['./billing-ebill-sign-up.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSxmUiBillingEbillSignUpComponent implements ComponentWithLocale, OnInit, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    signUpEBillForm: FormGroup;
    submitted = false;
    @Input() signUpEBillServerError = false;
    @Input() loading = false;
    @Input() email = '';
    @Input() ariaDescribedbyTextId = uuid();
    @Output() signUpEmailId: EventEmitter<string | void> = new EventEmitter();
    @Output() signupCancel: EventEmitter<string | void> = new EventEmitter();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _sxmValidators: SxmValidators,
        private readonly _emailAsyncValidator: EmailAsyncValidator,
        private _formBuilder: FormBuilder
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this._signUpEBillForm();
    }

    ngAfterViewInit(): void {
        this.signUpEBillForm.controls['email'].setValue(this.email);
    }

    private _signUpEBillForm() {
        this.signUpEBillForm = this._formBuilder.group({
            email: [
                '',
                {
                    validators: this._sxmValidators.emailForLookup,
                    asyncValidators: this._emailAsyncValidator.getValidator(),
                    updateOn: 'blur',
                },
            ],
        });
    }

    onSubmit() {
        this.signUpEBillForm.markAllAsTouched();
        this.submitted = true;
        if (this.signUpEBillForm.valid) {
            this.signUpEBillServerError = false;
            this.signUpEmailId.emit(this.signUpEBillForm.controls.email.value);
        }
    }

    onCancel() {
        this.clearForm();
        this.signupCancel.emit();
    }

    clearForm() {
        this.signUpEBillServerError = false;
        this.signUpEBillForm.markAsUntouched();
        this.signUpEBillForm.reset();
        this.submitted = false;
        this.signUpEBillForm.controls['email'].setValue(this.email);
    }
}

@NgModule({
    declarations: [SharedSxmUiBillingEbillSignUpComponent],
    exports: [SharedSxmUiBillingEbillSignUpComponent],
    imports: [
        CommonModule,
        SharedSxmUiUiEmailFormFieldModule,
        CommonModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiProceedButtonModule,
    ],
})
export class SharedSxmUiBillingEbillSignUpComponentModule {}
