import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DomainsIdentificationUiRadioIdAndAccountNumberLookupFormModule,
    RadioIdAndAccountNumberLookupFormComponentApi,
} from '@de-care/domains/identification/ui-radio-id-and-account-number-lookup-form';
import {
    DomainsIdentificationUiRadioIdAndLastnameLookupFormModule,
    RadioIdAndLastnameLookupFormComponentApi,
} from '@de-care/domains/identification/ui-radio-id-and-lastname-lookup-form';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SharedSxmUiUiModalModule, SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { DomainsIdentificationUiValidateLpzFormModule, ValidateLpzFormComponentApi } from '@de-care/domains/identification/ui-validate-lpz-form';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import {
    DomainsAccountStateAccountAndDeviceModule,
    ValidateRadioIdAndLoadAccountWorkflowService,
    ValidateRadioIdAndLoadAccountWorkflowServiceErrors,
} from '@de-care/domains/account/state-account-and-device';
import * as uuid from 'uuid/v4';

export type AdditionalFieldType = 'ACCOUNT_NUMBER' | 'LAST_NAME';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'radio-lookup-form',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        DomainsIdentificationUiRadioIdAndAccountNumberLookupFormModule,
        DomainsIdentificationUiRadioIdAndLastnameLookupFormModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiPrivacyPolicyModule,
        DomainsIdentificationUiValidateLpzFormModule,
        DomainsAccountStateAccountAndDeviceModule,
    ],
    templateUrl: './ui-radio-lookup.component.html',
    styleUrls: ['./ui-radio-lookup.component.scss'],
})
export class UiRadioLookupComponent implements ComponentWithLocale, AfterViewInit {
    translateKeyPrefix: string | undefined;
    languageResources: LanguageResources | undefined;
    selectedRadioId: string | null = null;
    @Input() additionalFieldType: AdditionalFieldType = 'ACCOUNT_NUMBER';
    @Output() deviceIdSelected = new EventEmitter<string>();
    @ViewChild('radioIdAndAccountNumberForm') private _radioIdAndAccountNumberForm: RadioIdAndAccountNumberLookupFormComponentApi;
    @ViewChild('radioIdAndLastNameForm') private _radioIdAndLastNameForm: RadioIdAndLastnameLookupFormComponentApi;
    @ViewChild('lpzModal') private _lpzModal: SxmUiModalComponent;
    @ViewChild('lpzFormComponent') private _lpzFormComponent: ValidateLpzFormComponentApi;
    radioLookupModalAriaDescribedbyTextId = uuid();

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _validateRadioIdAndLoadAccountWorkflowService: ValidateRadioIdAndLoadAccountWorkflowService
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'radiolookupform' }));
    }

    doRadioIdLookupByAccountNumber(data: { radioId: string; accountNumber: string }) {
        this.selectedRadioId = data.radioId;
        this.doRadioIdLookup(data, this._radioIdAndAccountNumberForm);
    }

    doRadioIdLookupByLastName(data: { radioId: string; lastName: string }) {
        this.selectedRadioId = data.radioId;
        this.doRadioIdLookup(data, this._radioIdAndLastNameForm);
    }

    private doRadioIdLookup(
        data: { radioId: string; accountNumber: string } | { radioId: string; lastName: string },
        radioIdForm: RadioIdAndAccountNumberLookupFormComponentApi | RadioIdAndLastnameLookupFormComponentApi
    ) {
        this._validateRadioIdAndLoadAccountWorkflowService.build(data).subscribe({
            next: () => {
                radioIdForm.completedLookupSuccess();
                // TODO: show device found modal
                this.deviceIdSelected.emit(data?.radioId);
            },
            error: (error: ValidateRadioIdAndLoadAccountWorkflowServiceErrors) => {
                switch (error) {
                    case 'INVALID_RADIO_ID':
                    case 'RADIO_ID_NOT_FOUND':
                    case 'LOOKUP_FAILED': {
                        radioIdForm.completedLookupFail();
                        break;
                    }
                    case 'LPZ_VALIDATION_REQUIRED': {
                        radioIdForm.completedLookupSuccess();
                        this._lpzModal.open();
                        break;
                    }
                    default: {
                        radioIdForm.showSystemError();
                    }
                }
            },
        });
    }

    closeLpzModal() {
        this._lpzModal.close();
    }

    lpzValidated(valid: boolean) {
        if (valid) {
            this._lpzFormComponent.reset();
            this._lpzFormComponent.setProcessingCompleted();
            this._lpzModal.close();
            // TODO: show device found modal
        } else {
            this._lpzFormComponent.setProcessingCompleted();
        }
    }
}
