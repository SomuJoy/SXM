import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { BehaviorSubject } from 'rxjs';

type RecoveryOption = 'userName' | 'password';

export interface RecoveryOptionSelection {
    recoveryOption: RecoveryOption;
}

export interface RecoveryOptionFormComponentApi {
    completedProcessing(): void;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'sxm-ui-credential-recovery',
    templateUrl: './credential-recovery.component.html',
    styleUrls: ['./credential-recovery.component.scss'],
})
export class SxmUiCredentialRecoveryComponent implements OnInit, ComponentWithLocale {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    form: FormGroup;
    @Output() recoveryCredentialOptionSelected = new EventEmitter<RecoveryOptionSelection>();
    submitInitiated = false;
    processingSubmission$ = new BehaviorSubject(false);

    constructor(private _formBuilder: FormBuilder, readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            credentialRecovery: new FormControl('userName', Validators.required),
        });
    }

    onSubmit() {
        this.submitInitiated = true;
        this.form.get('credentialRecovery').markAsTouched();
        if (this.form.valid) {
            this.processingSubmission$.next(true);
            this.recoveryCredentialOptionSelected.next({ recoveryOption: this.form.value.credentialRecovery });
        }
    }

    completedProcessing(): void {
        this.processingSubmission$.next(false);
    }
}
