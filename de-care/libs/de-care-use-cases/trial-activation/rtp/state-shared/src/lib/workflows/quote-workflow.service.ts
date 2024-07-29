import { Injectable } from '@angular/core';
import { getOfferType, getRenewalOffersPlanCodes, LoadRenewalOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { OfferRenewalRequest } from '@de-care/domains/offers/state-renewals';
import { LoadQuoteWorkflowService, QuoteRequestModel } from '@de-care/domains/quotes/state-quote';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { catchError, concatMap, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { Address } from '../state/models';
import { getLast4digitsOfRadioId, getOfferRenewalsRequestParams, getServiceAddress, getRenewalPlanCodeForQuote, getPlanCodeFromSelectedOffer } from '../state/selectors';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { PlanTypeEnum } from '@de-care/domains/account/state-account';

export const enum QuoteWorkflowStatus {
    success = 'success',
    fail = 'fail',
}

@Injectable({ providedIn: 'root' })
export class DataQuoteWorkflow implements DataWorkflow<QuoteRequestModel, any> {
    constructor(
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _loadRenewalOffersWorkflow: LoadRenewalOffersWorkflowService,
        private readonly _store: Store
    ) {}

    build() {
        return this._store.pipe(
            select(getLast4digitsOfRadioId),
            withLatestFrom(
                this._store.pipe(select(getPlanCodeFromSelectedOffer)),
                this._store.pipe(select(getRenewalPlanCodeForQuote)),
                this._store.pipe(select(getServiceAddress)),
                this._store.pipe(select(getOfferRenewalsRequestParams)),
                this._store.pipe(select(getIsCanadaMode)),
                this._store.pipe(select(getOfferType))
            ),
            take(1),
            concatMap(([radioId, planCode, renewalPlanCode, serviceAddress, request, canadaMode, offerType]) => {
                const serviceAddressUpperCountry = { ...serviceAddress };
                // country is changed to uppercase because lowercase causes problems in the tax description response from the quote service
                serviceAddressUpperCountry.country = serviceAddress?.country.toUpperCase();

                if ((canadaMode && offerType === PlanTypeEnum.RtpOffer) || offerType === PlanTypeEnum.TrialExtensionRTC) {
                    return this.getRenewals(request as OfferRenewalRequest).pipe(
                        switchMap((status) => {
                            if (status === QuoteWorkflowStatus.success) {
                                return this.fetchQuotes(radioId as string, planCode as string, serviceAddressUpperCountry as Address, renewalPlanCode);
                            } else {
                                return QuoteWorkflowStatus.fail;
                            }
                        })
                    );
                } else {
                    return this.fetchQuotes(radioId as string, planCode as string, serviceAddressUpperCountry as Address);
                }
            })
        );
    }

    getRenewals(request: OfferRenewalRequest) {
        return this._loadRenewalOffersWorkflow.build(request).pipe(
            map((success) => (success ? QuoteWorkflowStatus.success : QuoteWorkflowStatus.fail)),
            catchError(() => QuoteWorkflowStatus.fail)
        );
    }

    fetchQuotes(radioId: string, planCode: string, serviceAddress: Address, renewalPlanCode?: string) {
        return this._loadQuoteWorkflowService.build({ radioId, planCodes: [planCode], serviceAddress, ...(!!renewalPlanCode && { renewalPlanCode: renewalPlanCode }) }).pipe(
            map((result) => (result ? QuoteWorkflowStatus.success : QuoteWorkflowStatus.fail)),
            catchError(() => QuoteWorkflowStatus.fail)
        );
    }
}
