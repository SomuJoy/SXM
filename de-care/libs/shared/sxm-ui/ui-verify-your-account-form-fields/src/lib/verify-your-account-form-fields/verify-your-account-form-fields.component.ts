import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getSxmValidator } from '@de-care/shared/validation';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

export interface VerifyAccountFormComponentApi {
    completedProcessing(value): void;
    showSystemError(value): void;
    showBusinessError(value): void;
    showPhoneNumberNotMatchedError(value): void;
}

type VerifyType = 'email' | 'text';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-verify-your-account-form-fields',
    templateUrl: './verify-your-account-form-fields.component.html',
    styleUrls: ['./verify-your-account-form-fields.component.scss'],
})
export class VerifyYourAccountFormFieldsComponent implements OnInit, ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    form: FormGroup;
    @Output() submitVerifyAccountForm: EventEmitter<any> = new EventEmitter<any>();
    @Input() account: any;
    processingSubmission$ = new BehaviorSubject(false);
    isSystemError$ = new BehaviorSubject(false);
    isBusinessError$ = new BehaviorSubject(false);
    isPhoneNumberNotMatchedError$ = new BehaviorSubject(false);
    showTextVerify = false;
    private _unsubscribe$ = new Subject();
    submitted = false;
    @Input() firstOptionPreselected = true;
    canUseEmail = false;
    canUsePhone = false;
    maskedEmail = '';
    maskedPhone = '';
    accounts: any;

    constructor(private _formBuilder: FormBuilder, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.canUseEmail = this.account?.canUseEmail;
        this.canUsePhone = this.account?.canUsePhone;
        this.maskedEmail = this.account?.maskedEmail;
        this.maskedPhone = this.account?.maskedPhoneNumber;
        this.accounts = this.account;
        this.form = this._formBuilder.group({
            verifyType: [''],
            text: [null],
            agreeToTextMessage: [false],
        });
        const identifierTextControl = this.form.get('text');
        const identifierAgreeMessageControl = this.form.get('agreeToTextMessage');

        this.form
            .get('verifyType')
            .valueChanges.pipe(
                takeUntil(this._unsubscribe$),
                filter((value) => !!value)
            )
            .subscribe((verifyType: VerifyType) => {
                switch (verifyType) {
                    case 'text':
                        this._removeValidators(this.form);
                        identifierTextControl.setValidators(getSxmValidator('phoneNumber'));
                        identifierAgreeMessageControl.setValidators(Validators.requiredTrue);
                        identifierAgreeMessageControl.updateValueAndValidity();
                        break;
                    default:
                        this._removeValidators(this.form);
                        break;
                }
                this.submitted = false;
            });

        this.form.get('verifyType').setValue(this.firstOptionPreselected ? this._setInitialVerifyTypeFromInput() : null);
    }

    onVerifyAccountClick(): void {
        this.submitted = true;
        this.form.markAllAsTouched();
        const verifyType = this.form.get('verifyType').value;
        if (this.form.pending) {
            this.form.statusChanges
                .pipe(
                    filter((status) => status !== 'PENDING'),
                    take(1),
                    takeUntil(this._unsubscribe$)
                )
                .subscribe(() => {
                    this.onVerifyAccountClick();
                });
        } else if (this.form.valid && !!verifyType) {
            this.submitVerifyAccountForm.emit({ formValue: this.form.value, accountData: this.accounts });
        }
    }

    onSelect() {
        if (this.form.controls.verifyType.value === 'text') {
            this._removeValidators(this.form);
            this.form.get('text').setValidators(getSxmValidator('phoneNumber'));
            this.form.get('agreeToTextMessage').setValidators(Validators.requiredTrue);
            this.form.get('agreeToTextMessage').updateValueAndValidity();
            this.showTextVerify = true;
        } else {
            this.showTextVerify = false;
        }
    }

    private _removeValidators(form: FormGroup) {
        Object.keys(form.controls).forEach((controlName) => {
            if (controlName !== 'verifyType') {
                form.get(controlName).clearValidators();
                form.get(controlName).updateValueAndValidity();
            }
        });
    }

    private _setInitialVerifyTypeFromInput(): VerifyType {
        if (this.canUsePhone) {
            this.showTextVerify = true;
        }
        return !!this.canUsePhone ? 'text' : !!this.canUseEmail ? 'email' : null;
    }

    completedProcessing(value): void {
        this.processingSubmission$.next(value);
    }

    showSystemError(value): void {
        this.isSystemError$.next(value);
    }

    showPhoneNumberNotMatchedError(value): void {
        this.isPhoneNumberNotMatchedError$.next(value);
    }

    showBusinessError(value): void {
        this.isBusinessError$.next(value);
    }
}
