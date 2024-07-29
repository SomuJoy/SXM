import { Injectable } from '@angular/core';
import { getSecondaryStreamingSubscriptions } from '@de-care/domains/account/state-account';
import { getOfferPlanCode, LoadOffersCustomerWorkflowService } from '@de-care/domains/offers/state-offers';
import { LoadQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { concatMap, mapTo, take, withLatestFrom } from 'rxjs/operators';
import { setSecondDevice } from '../state/public.actions';
import { getPlatinumSubscriptionLast4, getSelectedStreamingAccount } from '../state/selectors';

enum LoadAddSecondRadioReviewProgramCodes {
    PlatinumVipUsa = 'PLTOFFERVIP',
}

@Injectable({
    providedIn: 'root',
})
export class LoadAddSecondRadioReviewDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadQuoteWorkflowService: LoadQuoteWorkflowService,
        private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService
    ) {}
    build(subscription) {
        this._store.dispatch(setSecondDevice({ device: subscription?.device }));
        return this._store.pipe(select(getSelectedStreamingAccount)).pipe(
            withLatestFrom(this._store.select(getPlatinumSubscriptionLast4), this._store.select(getSecondaryStreamingSubscriptions)),
            concatMap(([streamingAccount, radioId, secondaryStreamingSubscriptions]) =>
                this._loadOffersCustomerWorkflowService
                    .build({
                        radioId,
                        programCode: LoadAddSecondRadioReviewProgramCodes.PlatinumVipUsa,
                        streaming: subscription?.streaming ? true : false,
                    })
                    .pipe(
                        withLatestFrom(this._store.select(getOfferPlanCode)),
                        concatMap(([_, planCode]) => {
                            let selectedSubscription = secondaryStreamingSubscriptions.find((subscription) => subscription.streamingService.id === streamingAccount?.id);
                            return this._loadQuoteWorkflowService.build(
                                subscription?.streaming
                                    ? {
                                          planCodes: [planCode],
                                          subscriptionId: selectedSubscription ? selectedSubscription.id : 'streaming',
                                      }
                                    : { planCodes: [planCode], radioId: subscription?.device.radioId }
                            );
                        })
                    )
            ),
            mapTo(true),
            take(1)
        );
    }
}
