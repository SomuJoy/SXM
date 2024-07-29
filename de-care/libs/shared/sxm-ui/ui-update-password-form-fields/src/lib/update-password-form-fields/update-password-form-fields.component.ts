import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getSxmValidator } from '@de-care/shared/validation';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { BehaviorSubject } from 'rxjs';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

export interface LookupCompletedData {
    emailOrUserName: any;
}

export interface LookUpFormComponentApi {
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
    selector: 'sxm-ui-update-password-form-fields',
    templateUrl: './update-password-form-fields.component.html',
    styleUrls: ['./update-password-form-fields.component.scss'],
})
export class UpdatePasswordFormFieldsComponent implements OnInit, ComponentWithLocale {
    translateKeyPrefix: string;
    form: FormGroup;
    languageResources: LanguageResources;
    credentialsFormGroup: FormGroup;
    @Output() lookupCompleted = new EventEmitter<LookupCompletedData>();
    submitInitiated = false;
    processingSubmission$ = new BehaviorSubject(false);

    constructor(private _formBuilder: FormBuilder, readonly translationsForComponentService: TranslationsForComponentService, private _store: Store) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.credentialsFormGroup = this._formBuilder.group({
            username: [
                '',
                {
                    validators: getSxmValidator('registrationUserName'),
                    updateOn: 'blur',
                },
            ],
        });
    }

    onSubmit() {
        this.submitInitiated = true;
        this.credentialsFormGroup.get('username').markAsTouched();
        if (this.credentialsFormGroup.valid) {
            this.processingSubmission$.next(true);
            this.lookupCompleted.next({ emailOrUserName: this.credentialsFormGroup.value });
        } else {
            const errors = [];
            if (this.credentialsFormGroup.get('username').errors) {
                errors.push('Auth - Missing or invalid email or username');
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
