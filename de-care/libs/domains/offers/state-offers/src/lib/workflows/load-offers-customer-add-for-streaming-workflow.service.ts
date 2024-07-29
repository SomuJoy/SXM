import { Injectable } from '@angular/core';
import {
    behaviorEventReactionFirstOfferDevicePromoCode,
    behaviorEventReactionForPlansOffered,
    behaviorEventReactionOffersMarketType,
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { mapTo, tap } from 'rxjs/operators';
import { DataOffersCustomerAddService } from '../data-services/data-offers-customer-add.service';
import { getMarketTypeFromFirstOffer, getOffersPlanCodeAndPrice } from '../data-services/helpers';
import { setOffers } from '../state/actions/load-offers.actions';

@Injectable({ providedIn: 'root' })
export class LoadOffersCustomerAddForStreamingWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _dataOffersCustomerAddService: DataOffersCustomerAddService, private readonly _store: Store) {}

    build() {
        return this._dataOffersCustomerAddService.offersToAdd().pipe(
            tap(({ offers }) => {
                this._store.dispatch(behaviorEventReactionFirstOfferDevicePromoCode({ devicePromoCode: offers?.[0]?.promoCode }));
                this._store.dispatch(
                    behaviorEventReactionForPlansOffered({
                        plansOffered: getOffersPlanCodeAndPrice(offers),
                    })
                );
                this._store.dispatch(behaviorEventReactionOffersMarketType({ marketType: getMarketTypeFromFirstOffer(offers) }));
                this._store.dispatch(setOffers({ offers }));
            }),
            mapTo(true)
        );
    }
}
