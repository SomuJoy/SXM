import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerTypeEnum, LoadAccountFromAccountDataWorkflow, PlanTypeEnum } from '@de-care/domains/account/state-account';
import { ValidateDeviceWorkflowService } from '@de-care/domains/device/state-device-validate';
import { LoadAccountSessionInfoWorkflowService } from '@de-care/domains/account/state-session-data';
import { DeviceInfoWorkflow } from '@de-care/domains/device/state-device-info';
import { getAllOffersAsArray } from '@de-care/domains/offers/state-offers';
import {
    behaviorEventReactionForCustomerType,
    behaviorEventReactionForProgramCode,
    behaviorEventReactionForTransactionId,
    behaviorEventReactionUsedCarEligibilityCheckRadioId,
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import * as uuid from 'uuid/v4';
import { getIsCanadaMode } from '@de-care/settings';
import { setIsMCPFlow, setIsExtRtcFlow, setSelectedLeadOfferPlanCode, setTransactionId } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { getProvince, getSelectedProvince } from '@de-care/domains/customer/state-locale';
import { callDeviceInfoService } from '../../lib/state/actions';
import { LoadCustomerOffersAndConditionallyRenewalWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';

interface BuildArgs {
    radioId: string;
    programCode: string;
    usedCarBrandingType: string;
    accountNumber: string;
    pvtTime: string;
}

export const enum AccountActivationWorkflowStatus {
    success = 'success',
    fail = 'fail',
    offer400error = 'offer400error',
    offerTypeIsIncorrect = 'offerTypeIsIncorrect',
    sessionFailed = 'sessionFailed',
}

@Injectable({ providedIn: 'root' })
export class DataAccountActivationWorkflow implements DataWorkflow<any, any> {
    constructor(
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _loadCustomerOffersAndConditionallyRenewalWithCmsContent: LoadCustomerOffersAndConditionallyRenewalWithCmsContent,
        private readonly _loadAccountSessionInfoWorkflowService: LoadAccountSessionInfoWorkflowService,
        private readonly _validateDeviceWorkflowService: ValidateDeviceWorkflowService,
        private readonly _store: Store,
        private readonly _deviceInfoWorkflow: DeviceInfoWorkflow
    ) {}

    // url redirect will include radioId, programCode and usedCarBrandingType
    build(buildArgs: BuildArgs) {
        const { radioId, programCode, usedCarBrandingType, accountNumber, pvtTime } = buildArgs;
        this._store.dispatch(behaviorEventReactionUsedCarEligibilityCheckRadioId({ radioId }));
        this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }));
        return this._validateDeviceWorkflowService.build({ radioId }).pipe(
            withLatestFrom(this._store.select(getProvince)),
            concatMap(([, province]) =>
                this._loadAccountFromAccountDataWorkflow
                    .build({
                        radioId,
                        accountNumber,
                        pvtTime,
                    })
                    .pipe(
                        concatMap(() => this._loadCustomerOffers(radioId, usedCarBrandingType, programCode, province)),
                        catchError((error) => {
                            // account was not found, so we want to just proceed forward instead of treating it like an error
                            if (error instanceof HttpErrorResponse && error.status === 400) {
                                this._store.dispatch(callDeviceInfoService({ radioId }));
                                return this._loadCustomerOffers(radioId, usedCarBrandingType, programCode, province).pipe(
                                    switchMap((status) =>
                                        status === AccountActivationWorkflowStatus.success ? this._loadDeviceInfo(radioId) : AccountActivationWorkflowStatus.fail
                                    )
                                );
                            }
                            return of(AccountActivationWorkflowStatus.fail);
                        })
                    )
            ),
            catchError(() => of(AccountActivationWorkflowStatus.fail))
        );
    }

    private _isOfferTrialRtp(type: string): boolean {
        return type === PlanTypeEnum.RtpOffer;
    }

    private _isOfferPromoMcp(type: string): boolean {
        return type === PlanTypeEnum.PromoMCP;
    }

    private _isOfferTrialExt(type: string): boolean {
        return type === PlanTypeEnum.TrialExtension;
    }

    private _isOfferTrialEXTRTC(type: string): boolean {
        return type === PlanTypeEnum.TrialExtensionRTC;
    }

    private _handleOfferType(type: string): AccountActivationWorkflowStatus.success | AccountActivationWorkflowStatus.offerTypeIsIncorrect {
        if (this._isOfferPromoMcp(type)) {
            this._store.dispatch(setIsMCPFlow());
        }

        if (this._isOfferTrialEXTRTC(type)) {
            this._store.dispatch(setIsExtRtcFlow());
        }

        if (this._isOfferTrialRtp(type) || this._isOfferPromoMcp(type) || this._isOfferTrialExt(type) || this._isOfferTrialEXTRTC(type)) {
            this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: CustomerTypeEnum.RtpTrialActivation }));
            return AccountActivationWorkflowStatus.success;
        }
        return AccountActivationWorkflowStatus.offerTypeIsIncorrect;
    }

    private _loadDeviceInfo(radioID: string): Observable<AccountActivationWorkflowStatus> {
        return this._deviceInfoWorkflow.build(radioID).pipe(map((success) => (success ? AccountActivationWorkflowStatus.success : AccountActivationWorkflowStatus.fail)));
    }

    private _loadCustomerOffers(radioId: string, usedCarBrandingType: string, programCode: string, province?: string): Observable<AccountActivationWorkflowStatus> {
        const transactionId = `OAC-${uuid()}`;
        this._store.dispatch(setTransactionId({ transactionId }));
        this._store.dispatch(behaviorEventReactionForTransactionId({ transactionId }));
        return this._loadAccountSessionInfoWorkflowService.build().pipe(
            withLatestFrom(this._store.pipe(select(getIsCanadaMode)), this._store.pipe(select(getSelectedProvince))),
            concatMap(([_, isCanadaMode, prov]) =>
                this._loadCustomerOffersAndConditionallyRenewalWithCmsContent.build({
                    radioId,
                    usedCarBrandingType,
                    programCode,
                    streaming: false,
                    student: false,
                    province: prov,
                    shouldLoadRenewals: (offer) => {
                        if ((isCanadaMode && offer.type === PlanTypeEnum.RtpOffer) || offer.type === PlanTypeEnum.TrialExtensionRTC) {
                            return true;
                        }
                        return false;
                    },
                })
            ),
            withLatestFrom(this._store.pipe(select(getAllOffersAsArray))),
            concatMap(([_, offers]) => {
                if (offers.length > 0 && offers[0].planCode) {
                    if (offers.length === 1) {
                        this._store.dispatch(setSelectedLeadOfferPlanCode({ planCode: offers[0].planCode }));
                    }
                    return of(AccountActivationWorkflowStatus.success);
                } else {
                    return of(AccountActivationWorkflowStatus.fail);
                }
            }),
            catchError(() => of(AccountActivationWorkflowStatus.sessionFailed))
        );
    }
}
