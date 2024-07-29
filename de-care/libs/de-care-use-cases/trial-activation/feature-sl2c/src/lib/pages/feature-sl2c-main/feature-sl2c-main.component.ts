import { Component, OnInit } from '@angular/core';
import {
    getBrandingType,
    getCorpId,
    getFirstOfferTermLength,
    getProvinceIsQuebec,
    getVinNumber,
    selectOffer,
    setProvinceSelectionVisibleIfCanada,
    Sl2cForm,
    submitSl2cForm,
    trialActivationSl2cVM,
    setSubmissionIsProcessing
} from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    AddressCorrectionAction,
    AddressValidationState,
    CustomerValidationAddressesWorkFlowService,
    SimpleAddress
} from '@de-care/domains/customer/state-customer-verification';
import { behaviorEventImpressionForPage, behaviorEventReactionForCustomerType } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'de-care-trial-activation-sl2c-main',
    templateUrl: './feature-sl2c-main.component.html',
    styleUrls: ['./feature-sl2c-main.component.scss']
})
export class DeCareUseCasesTrialActivationSl2CMainComponent implements OnInit {
    readonly translationKeyPrefix = 'DeCareUseCasesTrialActivationFeatureSl2cModule.DeCareUseCasesTrialActivationSl2CMainComponent';

    offer$ = this._store.pipe(select(selectOffer));
    offerTermLength$ = this._store.pipe(select(getFirstOfferTermLength));
    brandingType$ = this._store.pipe(select(getBrandingType));
    corpId$ = this._store.pipe(select(getCorpId));
    isQuebec$ = this._store.pipe(select(getProvinceIsQuebec));
    vin$ = this._store.pipe(select(getVinNumber));
    vm$ = this._store.pipe(select(trialActivationSl2cVM));
    loadingSubmission = false;
    featureSl2cMainModalAriaDescribedbyTextId = uuid();

    private _submissionInfo: Sl2cForm;

    showInvalidAddressError = false;
    addressNeedsModification = false;
    unexpectedError = false;
    correctedAddress = null;
    avsInfo: AddressValidationState & { currentAddress: SimpleAddress };

    translateKey = 'DeCareUseCasesTrialActivationFeatureSl2cModule.DeCareUseCasesTrialActivationSl2CMainComponent.';

    constructor(private readonly _store: Store, private readonly _customerValidationAddressesWorkFlowService: CustomerValidationAddressesWorkFlowService) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));
        this._sendAnalytics();
    }

    private _sendAnalytics(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'trial_activation', componentKey: 'SL2C_LandingPage' }));
        this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: 'SL2C_TRIAL_ACTIVATION' }));
    }

    private _dismissAddressVerificationDialog() {
        this.correctedAddress = null;
        this.loadingSubmission = false;
        this.addressNeedsModification = false;
    }

    formSubmitted(formValues: Sl2cForm) {
        this.loadingSubmission = true;
        this.unexpectedError = false;
        this._submissionInfo = formValues;

        this._store.dispatch(setSubmissionIsProcessing());

        this._customerValidationAddressesWorkFlowService
            .build({
                serviceAddress: {
                    addressLine1: formValues.accountAddress.addressLine1,
                    city: formValues.accountAddress.city,
                    state: formValues.accountAddress.state,
                    zip: formValues.accountAddress.zip
                }
            })
            .subscribe({
                next: results => {
                    if (results.serviceAddress.addressCorrectionAction === AddressCorrectionAction.AutoCorrect) {
                        this.addressNeedsModification = false;
                        this._store.dispatch(submitSl2cForm({ formValues: this._submissionInfo }));
                    } else {
                        this.showInvalidAddressError = false;
                        this.addressNeedsModification = true;
                        this.avsInfo = {
                            ...results.serviceAddress,
                            currentAddress: formValues.accountAddress
                        };
                    }
                },
                error: () => {
                    this.unexpectedError = true;
                    this.loadingSubmission = false;
                }
            });
    }

    proceedWithCorrectedAddress(correctedAddress: any) {
        this.addressNeedsModification = false;
        this.correctedAddress = correctedAddress;

        this._store.dispatch(
            submitSl2cForm({
                formValues: {
                    ...this._submissionInfo,
                    accountAddress: correctedAddress
                }
            })
        );
    }

    onEditExistingAddress() {
        this._dismissAddressVerificationDialog();
    }

    modalClosed() {
        this._dismissAddressVerificationDialog();
    }
}
