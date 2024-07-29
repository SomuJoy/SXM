import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import {
    setFirstDevice,
    setLoadedPurchaseData,
    setProgramCode,
    setSecondDevices,
    setSelectedPlanCode,
    setSelectedStreamingPlanCode,
    setStreamingAccounts,
} from '../state/actions';
import { getAccountRadioInfoLast4, getRadioIdAndVehicleInfoFromAccountRadio, inboundQueryParams } from '../state/selectors';
import {
    LoadAccountFromVIPTokenWorkflowService,
    getSecondarySubscriptions,
    getAccountServiceAddressState,
    getSecondaryStreamingSubscriptions,
} from '@de-care/domains/account/state-account';
import { getFirstOfferIsFallback, getFirstOfferPlanCode, getSecondOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { TranslateService } from '@ngx-translate/core';
import { setErrorCode } from '../state/public.actions';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { handleOrganicVipEligibilityError } from '../helpers';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { setPageStartingProvince } from '@de-care/domains/customer/state-locale';
import { DeviceStatus } from '../state/models';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { initTransactionId } from '@de-care/de-care-use-cases/checkout/state-common';

@Injectable()
export class LoadCheckoutDataWorkflowService implements DataWorkflow<void, boolean> {
    public readonly MISSING_PROGRAM_CODE = 'MISSING_PROGRAM_CODE';
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromVIPTokenWorkflowService: LoadAccountFromVIPTokenWorkflowService,
        private readonly _loadOffersCustomerWorkflowService: LoadCustomerOffersWithCmsContent,
        private readonly _translateService: TranslateService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}

    handleError(errorResponse: any): Observable<boolean> {
        const errorCode = errorResponse?.error?.error?.fieldErrors?.[0]?.errorCode || errorResponse?.error?.error?.errorCode;
        if (errorResponse === this.MISSING_PROGRAM_CODE) {
            this._store.dispatch(setErrorCode({ errorCode: 'DEFAULT' }));
            return throwError(this.MISSING_PROGRAM_CODE);
        }
        const error = handleOrganicVipEligibilityError(errorResponse);
        if (error === 'fallback') {
            this._store.dispatch(setErrorCode({ errorCode }));
            return throwError('fallback');
        } else if (error === 'serverError') {
            this._store.dispatch(setErrorCode({ errorCode: 'DEFAULT' }));
            return throwError(errorCode);
        }
        this._store.dispatch(setErrorCode({ errorCode }));
        return throwError(errorCode);
    }

    build(): Observable<boolean> {
        return this._store.pipe(
            select(inboundQueryParams),
            take(1),
            concatMap(({ token, programCode, langPref }) => {
                if (!token || !programCode) {
                    throw this.MISSING_PROGRAM_CODE;
                }
                this._store.dispatch(setProgramCode({ programCode }));
                return of({ token, programCode, langPref });
            }),
            concatMap(({ token, programCode, langPref }) => this._updateUsecaseWorkflowService.build({ useCase: 'PVIP' }).pipe(map(() => ({ token, programCode, langPref })))),
            concatMap(({ token, programCode, langPref }) => {
                return this._loadAccountFromVIPTokenWorkflowService.build({ token, allowErrorHandler: false }).pipe(
                    withLatestFrom(
                        this._store.pipe(select(getAccountRadioInfoLast4)),
                        this._store.pipe(select(getSecondarySubscriptions)),
                        this._store.pipe(select(getSecondaryStreamingSubscriptions)),
                        this._store.select(getIsCanadaMode),
                        this._store.select(getAccountServiceAddressState)
                    ),
                    tap(([, , secondarySubscriptions, secondaryStreamingSubscriptions, isCanadaMode, province]) => {
                        this._store.dispatch(
                            setSecondDevices({
                                secondDevices: secondarySubscriptions.map((subscription) => {
                                    const plan = subscription.plans?.[0];
                                    return {
                                        radioId: subscription.radioService.last4DigitsOfRadioId,
                                        vehicle: subscription.radioService.vehicleInfo,
                                        status: plan ? (plan.type.toUpperCase() as DeviceStatus) : 'CLOSED',
                                        packageName: plan?.packageName,
                                    };
                                }),
                            })
                        );
                        const streamingAccounts = secondaryStreamingSubscriptions?.filter((sub) => sub?.streamingService);
                        this._store.dispatch(
                            setStreamingAccounts({
                                streamingAccounts: streamingAccounts?.map((subscription) => {
                                    const plan = subscription.plans?.[0];
                                    return {
                                        ...subscription.streamingService,
                                        packageName: plan?.packageName,
                                    };
                                }),
                            })
                        );
                        if (isCanadaMode) {
                            this._store.dispatch(setPageStartingProvince({ isDisabled: true, province }));
                        }
                    }),

                    concatMap(([, radioId, , , isCanadaMode, province]) => {
                        return this._loadOffersCustomerWorkflowService
                            .build({ streaming: false, student: false, programCode, radioId, ...(isCanadaMode && { province }) })
                            .pipe(
                                tap(() => programCode && this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))),
                                withLatestFrom(this._store.pipe(select(getFirstOfferIsFallback))),
                                concatMap(([, offerIsFallback]) => {
                                    if (offerIsFallback) {
                                        return throwError('Offer not available!');
                                    }
                                    return this._store.pipe(
                                        select(getFirstOfferPlanCode),
                                        withLatestFrom(this._store.select(getSecondOfferPlanCode), this._store.pipe(select(getRadioIdAndVehicleInfoFromAccountRadio))),
                                        tap(([planCode, secondOfferPlancode, device]) => {
                                            this._store.dispatch(setSelectedPlanCode({ planCode }));
                                            //Hardcoded value will need to be removed once SMS reenables the offer
                                            //and we can confirm that it is returned in the offers call as the second offer
                                            secondOfferPlancode = 'Streaming Platinum VIP - 1mo';
                                            this._store.dispatch(
                                                setSelectedStreamingPlanCode({
                                                    streamingPlanCode: secondOfferPlancode,
                                                })
                                            );
                                            this._store.dispatch(setFirstDevice({ device }));
                                            this._store.dispatch(
                                                setLoadedPurchaseData({
                                                    token,
                                                })
                                            );
                                            if (langPref) {
                                                this._translateService.currentLang = langPref;
                                            }
                                        }),
                                        mergeMap(() => of(true))
                                    );
                                })
                            );
                    }),
                    tap(() => {
                        this._store.dispatch(initTransactionId());
                    })
                );
            }),
            catchError((errorResponse) => this.handleError(errorResponse))
        );
    }
}
