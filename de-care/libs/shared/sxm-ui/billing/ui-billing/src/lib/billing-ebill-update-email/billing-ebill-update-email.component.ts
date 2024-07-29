import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
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
    selector: 'sxm-ui-billing-ebill-update-email',
    templateUrl: './billing-ebill-update-email.component.html',
    styleUrls: ['./billing-ebill-update-email.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSxmUiBillingEbillUpdateEmailComponent implements ComponentWithLocale, OnInit, OnChanges, AfterViewInit {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    updateEmailForm: FormGroup;
    submitted = false;
    @Input() updateEmailServerError = false;
    @Input() loading = false;
    @Input() email = '';
    @Input() ariaDescribedbyTextId = uuid();
    @Output() updateEmailId: EventEmitter<string | void> = new EventEmitter();
    @Output() updateEmailCancel: EventEmitter<string | void> = new EventEmitter();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _sxmValidators: SxmValidators,
        private readonly _emailAsyncValidator: EmailAsyncValidator,
        private _formBuilder: FormBuilder
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this._updateEmailForm();
    }

    ngAfterViewInit(): void {
        this.updateEmailForm.controls['email'].setValue(this.email);
    }

    private _updateEmailForm() {
        this.updateEmailForm = this._formBuilder.group({
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

    ngOnChanges(simpleChanges: SimpleChanges): void {
        if (this.updateEmailForm && simpleChanges.data) {
            this.updateEmailForm.controls['email'].setValue(simpleChanges.data?.currentValue?.email);
        }
    }

    onSubmit() {
        this.updateEmailForm.markAllAsTouched();
        this.submitted = true;
        if (this.updateEmailForm.valid) {
            this.updateEmailServerError = false;
            this.updateEmailId.emit(this.updateEmailForm.controls.email.value);
        }
    }

    onCancel() {
        this.clearForm();
        this.updateEmailCancel.emit();
    }

    clearForm() {
        this.updateEmailServerError = false;
        this.updateEmailForm.markAsUntouched();
        this.updateEmailForm.reset();
        this.submitted = false;
    }
}

@NgModule({
    declarations: [SharedSxmUiBillingEbillUpdateEmailComponent],
    exports: [SharedSxmUiBillingEbillUpdateEmailComponent],
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
export class SharedSxmUiBillingEbillUpdateEmailComponentModule {}
