import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
    FindAccountByRadioIdOrVinOrLicensePlateWorkflowError,
    FindAccountByRadioIdOrVinOrLicensePlateWorkflowService,
    getHideChatWithAnAgentLink,
} from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { getSxmValidator } from '@de-care/shared/validation';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid/v4';

type LookupType = 'radioId' | 'vin' | 'licensePlate';

export interface DeviceIdSelection {
    lookupType: LookupType;
    identifier?: string | { licensePlate: string; state: string };
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-radio-id-lookup-page',
    templateUrl: './radio-id-lookup-page.component.html',
    styleUrls: ['./radio-id-lookup-page.component.scss'],
})
export class RadioIdLookupPageComponent implements ComponentWithLocale {
    @ViewChild('helpFindingRadioModal') private readonly _helpFindingRadioModal: SxmUiModalComponent;
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    form: FormGroup;
    showRadioIdError = false;
    processingSubmission$ = new BehaviorSubject(false);
    isSystemError = false;
    isRadioIdExist = false;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    deviceIdSelected: DeviceIdSelection;
    hideChatWithAnAgentLink$ = this._store.pipe(select(getHideChatWithAnAgentLink));

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private _formBuilder: FormBuilder,
        private readonly _findAccountByRadioIdOrVinWorkflowService: FindAccountByRadioIdOrVinOrLicensePlateWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _store: Store
    ) {
        translationsForComponentService.init(this);
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            radioId: ['', getSxmValidator('radioId')],
        });
    }

    openFindradioIdModal() {
        this._helpFindingRadioModal.open();
    }

    onSubmit() {
        this.isSystemError = false;
        this.isRadioIdExist = false;
        this.form.get('radioId').markAsTouched();
        if (this.form.valid) {
            this.processingSubmission$.next(true);
            this.deviceIdSelected = { lookupType: 'radioId', identifier: this.form?.get('radioId').value };
            this._findAccountByRadioIdOrVinWorkflowService.build(this.deviceIdSelected).subscribe({
                next: () => {
                    this._navigateTo('../registration');
                    return;
                },
                error: (error: { errorType: FindAccountByRadioIdOrVinOrLicensePlateWorkflowError }) => {
                    if (error && error.errorType) {
                        if (
                            error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.RADIO_ID_NOT_FOUND ||
                            error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.RADIO_NOT_ACTIVE
                        ) {
                            this.isRadioIdExist = true;
                        } else if (error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.BUSINESS) {
                            this.isRadioIdExist = true;
                        } else if (error.errorType === FindAccountByRadioIdOrVinOrLicensePlateWorkflowError.CLOSED_RADIO_ID) {
                            this._navigateTo('../inactive-subscription');
                        } else {
                            this.isSystemError = true;
                        }
                    } else {
                        this.isSystemError = true;
                    }
                    this.processingSubmission$.next(false);
                },
                complete: () => {
                    this.processingSubmission$.next(false);
                },
            });
        } else {
            const errors = [];
            if (this.form.get('radioId').errors) {
                errors.push('Auth - Missing or invalid radio ID');
            }
        }
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute }).then(() => {
            this.processingSubmission$.next(false);
        });
    }
}
