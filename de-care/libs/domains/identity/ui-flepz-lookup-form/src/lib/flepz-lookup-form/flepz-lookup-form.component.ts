import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { SharedSxmUiUiFlepzFormFieldsModule } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { map } from 'rxjs/operators';

export interface FlepzData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    zipCode: string;
}

export interface FlepzLookupFormComponentApi {
    setProcessingCompleted(): void;
    showSystemError(): void;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'flepz-lookup-form',
    templateUrl: './flepz-lookup-form.component.html',
    styleUrls: ['./flepz-lookup-form.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        SharedSxmUiUiFlepzFormFieldsModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiPostalCodeFormFieldModule,
    ],
    standalone: true,
})
export class FlepzLookupFormComponent implements ComponentWithLocale, FlepzLookupFormComponentApi {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    submitInitiated = false;
    form: FormGroup;
    invalidZipFromLookupError$ = new BehaviorSubject(false);
    showSystemError$ = new BehaviorSubject(false);
    processingSubmission$ = new BehaviorSubject(false);
    @Output() flepzDataReadyToProcess = new EventEmitter<FlepzData>();
    protected countryCodeIsCanada$: Observable<boolean>;

    constructor(private readonly _formBuilder: FormBuilder, private _sxmValidators: SxmValidators, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
        this.countryCodeIsCanada$ = translationsForComponentService.currentCountryCode$.pipe(map((countryCode) => countryCode === 'ca'));
        this.form = this._formBuilder.group({
            firstName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            lastName: new FormControl(null, { validators: this._sxmValidators.namePiece, updateOn: 'blur' }),
            phoneNumber: new FormControl(null, { validators: this._sxmValidators.phoneNumber, updateOn: 'blur' }),
            zipCode: new FormControl(null, { validators: this._sxmValidators.postalCode, updateOn: 'blur' }),
            email: new FormControl(null, this._sxmValidators.emailForLookup),
        });
    }

    onFormSubmit() {
        this.submitInitiated = true;
        this.showSystemError$.next(false);
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.processingSubmission$.next(true);
            this.flepzDataReadyToProcess.emit(this.form.value);
        }
    }

    setProcessingCompleted(): void {
        this.processingSubmission$.next(false);
    }

    showSystemError(): void {
        this.showSystemError$.next(true);
    }
}
