import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { LoadFlepzDataSuccess } from '@de-care/purchase-state';
import { LoadOffersCustomerWorkflowService } from '@de-care/domains/offers/state-offers';
import { getOffersLoadedAndUpsellRequestData } from '../state/checkout-triage.selectors';
import { SelectedUpsell, UpdatePlan } from '@de-care/checkout-state';

@Injectable({ providedIn: 'root' })
export class LoadCustomerFallbackOfferForFailedStreamingEligibilityWorkflowService implements DataWorkflow<string | undefined | null, string> {
    constructor(private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService, private readonly _store: Store) {}

    build(province?: string): Observable<string> {
        // We are making use of our domain offers state lib to do the customer offers call...
        return this._loadOffersCustomerWorkflowService.build({ retrieveFallbackOffer: true, streaming: true, ...(province && { province }) }).pipe(
            // TODO: when checkout refactor is done we should be able to remove all of this custom logic for legacy checkout state from here
            // ...until then,
            //    we need to support all the legacy checkout/purchase state stuff. To do that we
            //    need to get the loaded offer(s) and start passing that data as payloads to the existing
            //    legacy actions to get all the data in the right places (in both checkout-state and purchase-state)
            //    and try and orchestrate all the right side effects that are spread throughout these states.
            withLatestFrom(this._store.select(getOffersLoadedAndUpsellRequestData)),
            map(([, offersLoadedAndUpsellRequestData]) => offersLoadedAndUpsellRequestData),
            tap(({ offers, programCode, account }) => {
                // 1. We need to update the selected offer in the checkout-state
                //
                //      The action SelectedUpsell is the one that is actually setting the selected offer. :(
                //      NOTE - we have to dispatch this first to get the selected offer set since
                //      there is an effect that reacts to LoadFlepzDataSuccess that uses the selected plan
                //      to do an offers info call
                this._store.dispatch(
                    SelectedUpsell({
                        payload: {
                            // these offer models are different so we need to "any" them here for triage
                            offers: offers as any[],
                        },
                    })
                );

                this._store.dispatch(
                    UpdatePlan({
                        payload: {
                            // these offer models are different so we need to "any" them here for triage
                            offers: offers as any[],
                        },
                    })
                );

                // 2. We need to use the action to get all the data into purchase-state
                //
                this._store.dispatch(
                    LoadFlepzDataSuccess({
                        payload: {
                            programCode,
                            account,
                            offer: {
                                // these offer models are different so we need to "any" them here for triage
                                offers: offers as any[],
                            },
                        },
                    })
                );
            }),
            // NOTE: this returns the loaded plan code since there are scenarios where the actions above
            //       are still in flight while the subscriber of this Observable has already been notified
            //       that a new value came through and that caller needs to be able to get to this plan code.
            map(({ offers }) => offers[0].planCode)
        );
    }
}
