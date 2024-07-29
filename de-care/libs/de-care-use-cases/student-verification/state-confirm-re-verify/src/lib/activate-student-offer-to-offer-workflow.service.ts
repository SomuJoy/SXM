import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { getFirstAccountSubscription } from '@de-care/domains/account/state-account';
import { LoadOffersCustomerWorkflowService, getPlanCodeFromSelectedOffer } from '@de-care/domains/offers/state-offers';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, withLatestFrom } from 'rxjs/operators';
import { OfferToOfferWorkflowService } from '@de-care/domains/purchase/state-change-subscription';

export enum ActivateStudentOfferToOfferWorkflowServiceStatus {
    'success' = 'success',
    'fail' = 'fail'
}

@Injectable({ providedIn: 'root' })
export class ActivateStudentOfferToOfferWorkflowService implements DataWorkflow<{ programCode: string }, ActivateStudentOfferToOfferWorkflowServiceStatus> {
    constructor(
        private _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private _offerToOfferWorflowService: OfferToOfferWorkflowService,
        private _store: Store
    ) {}

    build({ programCode }): Observable<ActivateStudentOfferToOfferWorkflowServiceStatus> {
        return this._store.pipe(
            select(getFirstAccountSubscription),
            concatMap(subscription => this._loadOffers(subscription?.id, programCode)),
            mapTo(ActivateStudentOfferToOfferWorkflowServiceStatus.success),
            catchError(() => of(ActivateStudentOfferToOfferWorkflowServiceStatus.fail))
        );
    }

    private _loadOffers(subscriptionId, programCode) {
        return this._loadOffersCustomerWorkflowService
            .build({
                subscriptionId,
                programCode,
                streaming: true,
                student: true
            })
            .pipe(
                withLatestFrom(this._store.pipe(select(getPlanCodeFromSelectedOffer))),
                concatMap(([_, planCode]) => {
                    if (planCode) {
                        return this._purchaseOfferToOffer(subscriptionId, planCode);
                    }
                    return throwError(new Error('PlanCode cannot be null'));
                })
            );
    }

    private _purchaseOfferToOffer(subscriptionId: string, planCode: string) {
        return this._offerToOfferWorflowService.build({
            subscriptionId,
            plans: [{ planCode: planCode }]
        });
    }
}
