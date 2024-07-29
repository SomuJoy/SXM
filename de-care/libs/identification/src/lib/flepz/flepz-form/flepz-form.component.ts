import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { buildAndJoinTranslation, initiateTranslationOverride, TranslationOverrides } from '@de-care/app-common';
import { IdentityFlepzRequestModel, IdentityRequestModel, DataIdentityService, SubscriptionModel, DataIdentityRequestStoreService } from '@de-care/data-services';
import { DataLayerService, BusinessErrorEnum } from '@de-care/data-layer';
import { TranslateService } from '@ngx-translate/core';
import { controlIsInvalid } from '@de-care/shared/validation';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
    behaviorEventErrorFromBusinessLogic,
    behaviorEventReactionLookupByFlepzFailure,
    behaviorEventReactionLookupByFlepzSuccess,
    behaviorEventReactionAuthenticationByFlepzSuccess,
    behaviorEventReactionAuthenticationByFlepzFailure,
} from '@de-care/shared/state-behavior-events';

export interface SharedFlepzFormFlepzInfo {
    flepz: IdentityFlepzRequestModel;
    subscriptions: SubscriptionModel[];
}

export enum FlepzFormSearchErrors {
    UnableToConfirmAccount = 'identification.flepzFormComponent.ERROR',
    NoRadiosOnAccount = 'identification.flepzFormComponent.NO_RADIO',
    InvalidPhoneNumber = 'identification.flepzFormComponent.PHONE_INVALID',
}

export interface ErrorMsgAlternativeLookupLinkData {
    hasAlternativeLookupLink: boolean;
    alternativeLookupId?: string;
    alternativeLookupLinkText?: string;
    alternativeLookupLinkDesc?: string;
}

@Component({
    selector: 'flepz-form',
    templateUrl: './flepz-form.component.html',
    styleUrls: ['./flepz-form.component.scss'],
})
export class FlepzFormComponent implements OnChanges, OnInit {
    @Input() prefilledAccountData: {
        firstName: string;
        lastName: string;
    };
    @Input() isProspectTrial = false;
    @Input() translationOverrides: TranslationOverrides;
    @Input() errorMsgAlternativeLookupLinkData: ErrorMsgAlternativeLookupLinkData;
    @Input() nflOptInEnabled = false;
    @Output() selectedFlepzInfo = new EventEmitter<SharedFlepzFormFlepzInfo>();
    @Output() dontSeeYourRadio = new EventEmitter<void>();
    @Output() switchAlternativeLookup = new EventEmitter<void>();

    submitted: boolean = false;
    isNFLOptIn = false;
    // TODO: refactor to remove this as it appears to not be used for anything...
    @Input() set flepzError(error: FlepzFormSearchErrors) {
        this._flepzError = error || null;
    }

    get flepzError() {
        return this._flepzError;
    }

    flepzForm: FormGroup;
    loading: boolean = false;

    private _flepzError: FlepzFormSearchErrors = null;

    get frmControls(): {
        [key: string]: AbstractControl;
    } {
        return this.flepzForm.controls;
    }

    controlIsInvalid = controlIsInvalid(() => {
        return this.submitted;
    });

    constructor(
        private formBuilder: FormBuilder,
        private _dataIdentifyService: DataIdentityService,
        private _dataLayerSrv: DataLayerService,
        private _identityRequestStoreService: DataIdentityRequestStoreService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _translateService: TranslateService,
        private _store: Store
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.translationOverrides && changes.translationOverrides.currentValue !== changes.translationOverrides.previousValue) {
            initiateTranslationOverride(this.translationOverrides).map((flatTranslation) =>
                flatTranslation
                    .map(buildAndJoinTranslation('identification', 'flepzFormComponent'))
                    .forEach(({ locale, translation }) => this._translateService.setTranslation(locale, translation, true))
            );
        }
    }

    ngOnInit() {
        this.flepzForm = this.formBuilder.group({
            flepz: new FormControl(''),
        });
    }

    doFlepzSearch() {
        this.submitted = true;
        this.flepzError = null;
        if (this.flepzForm.valid) {
            this.loading = true;

            const value: IdentityFlepzRequestModel = this.flepzForm.value.flepz;
            if (this.isProspectTrial) {
                value.prospectTrial = this.isProspectTrial;
            }
            value.optInForNFL = this.isNFLOptIn;
            const identityRequestData: IdentityRequestModel = { requestType: 'flepz', flepzInfo: value };
            this._identityRequestStoreService.setIdentityRequestData(identityRequestData);
            this._dataIdentifyService.customerFlepz(value).subscribe(
                (data) => {
                    this.loading = false;
                    this._store.dispatch(behaviorEventReactionLookupByFlepzSuccess());
                    if (data.length > 0) {
                        this.selectedFlepzInfo.emit({
                            subscriptions: data,
                            flepz: this.flepzForm.value.flepz,
                        });
                        this._store.dispatch(behaviorEventReactionAuthenticationByFlepzSuccess());
                    } else {
                        this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: BusinessErrorEnum.EventLoginNoRadio }));
                        this._showError(FlepzFormSearchErrors.NoRadiosOnAccount);
                        this._store.dispatch(behaviorEventReactionAuthenticationByFlepzFailure());
                    }
                },
                (error) => {
                    if (this._hasInvalidPhoneNumber(error)) {
                        //The flepz-form-fields component would handle the data-layer error since it is a field error
                        this._showError(FlepzFormSearchErrors.InvalidPhoneNumber);
                    } else {
                        this._store.dispatch(behaviorEventErrorFromBusinessLogic({ message: BusinessErrorEnum.EventFlepzNoRadio }));
                        this._showError(FlepzFormSearchErrors.UnableToConfirmAccount);
                    }
                    this._store.dispatch(behaviorEventReactionLookupByFlepzFailure());
                }
            );
        }
    }

    private _hasInvalidPhoneNumber(error: HttpErrorResponse) {
        if (error.error && error.error.error && error.error.error.fieldErrors && error.error.error.fieldErrors.length > 0) {
            const fieldErrors = error.error.error.fieldErrors;
            const invalidPhoneError = fieldErrors.filter((item) => item.errorCode === 'PHONE_INVALID');
            if (invalidPhoneError && invalidPhoneError.length > 0) {
                return true;
            }
        }

        return false;
    }

    private _showError(flepzError: FlepzFormSearchErrors): void {
        this.loading = false;
        this.flepzError = flepzError;
        this._changeDetectorRef.markForCheck();
    }

    hasDynamicErrorMsgWithAlternativeLookupLink(): boolean {
        return this.flepzError === FlepzFormSearchErrors.NoRadiosOnAccount && this.errorMsgAlternativeLookupLinkData.hasAlternativeLookupLink;
    }

    onDontSeeYourRadio() {
        this.dontSeeYourRadio.emit();
    }

    onSwitchAlternativeLookup($event) {
        this.switchAlternativeLookup.emit();
    }

    onVerifyAccountClick(value) {
        this.isNFLOptIn = value?.nflForOptIn;
    }
}
