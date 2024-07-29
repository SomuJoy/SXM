import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SxmValidators } from '@de-care/shared/forms-validation';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

export interface ForgotUsernameLookupCompletedData {
    emailOrUserName: any;
}

export interface ForgotUsernameFormComponentApi {
    completedProcessing(value): void;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-forgot-username-form',
    templateUrl: './forgot-username-form.component.html',
    styleUrls: ['./forgot-username-form.component.scss'],
})
export class ForgotUsernameFormComponent implements OnInit, ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    credentialsFormGroup: FormGroup;
    @Output() lookupCompleted = new EventEmitter<ForgotUsernameLookupCompletedData>();
    submitInitiated = false;
    processingSubmission$ = new BehaviorSubject(false);

    constructor(
        private _formBuilder: FormBuilder,
        readonly translationsForComponentService: TranslationsForComponentService,
        private _sxmValidators: SxmValidators,
        private _store: Store
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.credentialsFormGroup = this._formBuilder.group({
            lastname: new FormControl(null, { validators: [this._sxmValidators.namePiece], updateOn: 'blur' }),
            email: new FormControl(null, { validators: [this._sxmValidators.emailForLookup], updateOn: 'blur' }),
        });
    }

    onSubmit() {
        this.submitInitiated = true;
        this.credentialsFormGroup.get('lastname').markAsTouched();
        this.credentialsFormGroup.get('email').markAsTouched();
        if (this.credentialsFormGroup.valid) {
            this.processingSubmission$.next(true);
            this.lookupCompleted.next({ emailOrUserName: this.credentialsFormGroup.value });
        } else {
            const errors = [];
            if (this.credentialsFormGroup.get('lastname').errors) {
                errors.push('Auth - Missing or invalid  lastname');
            }
            if (this.credentialsFormGroup.get('email').errors) {
                errors.push('Auth - Missing or invalid  email');
            }
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
        }
    }

    completedProcessing(value): void {
        this.processingSubmission$.next(value);
    }
}
