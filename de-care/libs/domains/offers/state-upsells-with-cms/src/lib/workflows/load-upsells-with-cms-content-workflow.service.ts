import { Injectable } from '@angular/core';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { loadUpsellOfferInfoForUpsellOffers } from '@de-care/domains/offers/state-upsell-offers-info';
import { getAllUpsellPlanCodes, getUpsellPlanCodesByType, getUpsellsExist, LoadUpsellOffersWorkflowService } from '@de-care/domains/offers/state-upsells';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { combineLatest, iif, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { clearUpsellOffersWithCms } from '../state/public.actions';

export interface WorkflowRequest {
    planCode: string;
    radioId?: string;
    streaming?: boolean;
    subscriptionId?: string;
    upsellCode?: string;
    satUpsellCode?: string;
    province?: string;
    retrieveFallbackOffer?: boolean;
    locales: string[];
    country: string;
}

@Injectable({ providedIn: 'root' })
export class LoadUpsellsWithCmsContentWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _loadUpsellOffersWorkflowService: LoadUpsellOffersWorkflowService,
        private readonly _store: Store,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        const { locales, country, ...baseRequest } = request;
        return this._loadUpsellOffersWorkflowService.build(baseRequest).pipe(
            withLatestFrom(this._store.select(getUpsellsExist)),
            switchMap(([, upsellsExist]) => {
                return iif(
                    () => upsellsExist,
                    combineLatest([this._store.select(getUpsellPlanCodesByType), this._store.select(getAllUpsellPlanCodes)]).pipe(
                        tap(([{ packageUpsellPlanCode, termUpsellPlanCode, packageAndTermUpsellPlanCode }]) => {
                            this._store.dispatch(
                                loadUpsellOfferInfoForUpsellOffers({
                                    upsellOffersInfoRequest: {
                                        leadOfferPlanCode: request.planCode,
                                        packageUpsellPlanCode,
                                        termUpsellPlanCode,
                                        packageAndTermUpsellPlanCode,
                                        province: request.province,
                                        locales,
                                        country,
                                    },
                                })
                            );
                        }),
                        concatMap(([, planCodes]) =>
                            this._loadOffersInfoWorkflowService.build({
                                planCodes: planCodes.map((leadOfferPlanCode) => ({ leadOfferPlanCode })),
                                locales,
                            })
                        ),
                        map(() => true)
                    ),
                    of(true)
                );
            }),
            catchError((error) => {
                this._store.dispatch(clearUpsellOffersWithCms());
                return throwError(error);
            })
        );
    }
}
