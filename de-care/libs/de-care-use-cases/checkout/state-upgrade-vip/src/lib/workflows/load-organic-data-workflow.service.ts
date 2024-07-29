import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { setProgramCode, setSelectedPlanCode, setSelectedStreamingPlanCode } from '../state/actions';
import { inboundQueryParams } from '../state/selectors';
import { getFirstOfferIsFallback, getFirstOfferPlanCode, getSecondOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { TranslateService } from '@ngx-translate/core';
import { setErrorCode } from '../state/public.actions';
import { behaviorEventReactionForProgramCode } from '@de-care/shared/state-behavior-events';
import { LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { handleOrganicVipEligibilityError } from '../helpers';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { GetProvinceFromCurrentIpWorkflowService, getProvinceFromIp } from '@de-care/domains/utility/state-ip-location';
import { setPageStartingProvince } from '@de-care/domains/customer/state-locale';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { initTransactionId } from '@de-care/de-care-use-cases/checkout/state-common';

@Injectable()
export class LoadOrganicDataWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadOffersWithCmsContent: LoadOffersWithCmsContent,
        private readonly _translateService: TranslateService,
        private readonly _getProvinceFromCurrentIpWorkflowService: GetProvinceFromCurrentIpWorkflowService,
        private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService
    ) {}
    public readonly MISSING_PROGRAM_CODE = 'MISSING_PROGRAM_CODE';

    build(province?: string): Observable<boolean> {
        return this._store.select(inboundQueryParams).pipe(
            take(1),
            tap(({ programCode, langPref }) => {
                langPref && (this._translateService.currentLang = langPref);
                if (!programCode) {
                    throw this.MISSING_PROGRAM_CODE;
                }
                this._store.dispatch(setProgramCode({ programCode }));
            }),
            concatMap(({ programCode }) => {
                if (province) {
                    return of({ programCode, province });
                }
                return this._getCanadaProvinceFromIp(programCode);
            }),
            concatMap(({ programCode, province }) =>
                this._updateUsecaseWorkflowService.build({ useCase: 'PVIP' }).pipe(
                    concatMap(() => {
                        return this._loadOffersWithCmsContent.build({ programCode, streaming: false, student: false, ...(province && { province }) }).pipe(mapTo(programCode));
                    })
                )
            ),
            tap((programCode) => this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))),
            withLatestFrom(this._store.select(getFirstOfferIsFallback), this._store.select(getFirstOfferPlanCode), this._store.select(getSecondOfferPlanCode)),
            tap(([, offerIsFallback, planCode, secondOfferPlancode]) => {
                if (offerIsFallback) {
                    throw 'Offer not available!';
                }
                this._store.dispatch(
                    setSelectedPlanCode({
                        planCode,
                    })
                );
                //Hardcoded value will need to be removed once SMS reenables the offer
                //and we can confirm that it is returned in the offers call as the second offer
                secondOfferPlancode = 'Streaming Platinum VIP - 1mo';
                this._store.dispatch(
                    setSelectedStreamingPlanCode({
                        streamingPlanCode: secondOfferPlancode,
                    })
                );
                this._store.dispatch(initTransactionId());
            }),
            mapTo(true),
            catchError((errorResponse) => {
                const errorCode = errorResponse?.error?.error?.errorCode;
                if (errorResponse === this.MISSING_PROGRAM_CODE) {
                    this._store.dispatch(setErrorCode({ errorCode: 'DEFAULT' }));
                    return throwError(this.MISSING_PROGRAM_CODE);
                }
                const error = handleOrganicVipEligibilityError(errorResponse);
                if (error === 'serverError') {
                    this._store.dispatch(setErrorCode({ errorCode: 'DEFAULT' }));
                    return throwError(errorCode);
                }
                this._store.dispatch(setErrorCode({ errorCode }));
                return throwError(errorCode);
            })
        );
    }

    private _getCanadaProvinceFromIp(programCode: string) {
        return this._store.select(getIsCanadaMode).pipe(
            take(1),
            concatMap((isCanada) => {
                if (isCanada) {
                    return this._getProvinceFromCurrentIpWorkflowService.build().pipe(
                        withLatestFrom(this._store.select(getProvinceFromIp)),
                        tap(([, province]) => {
                            this._store.dispatch(setPageStartingProvince({ isDisabled: false, province }));
                        }),
                        map(([, province]) => ({ programCode, province }))
                    );
                }
                return of({ programCode, province: null });
            })
        );
    }
}
