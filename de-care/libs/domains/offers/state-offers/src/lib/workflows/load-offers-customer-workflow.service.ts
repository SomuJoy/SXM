import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataOffersCustomerService, OffersCustomerRequest, OffersCustomerWithBrandingAndRadioIdRequest } from '../data-services/data-offers-customer.service';
import { Offer } from '../data-services/offer.interface';
import { setOffers } from './../state/actions/load-offers.actions';
import {
    behaviorEventReactionFirstOfferDevicePromoCode,
    behaviorEventReactionForPlansOffered,
    behaviorEventReactionOffersMarketType
} from '@de-care/shared/state-behavior-events';
import { getOffersPlanCodeAndPrice, getMarketTypeFromFirstOffer } from '../data-services/helpers';

@Injectable({ providedIn: 'root' })
export class LoadOffersCustomerWorkflowService implements DataWorkflow<OffersCustomerRequest | OffersCustomerWithBrandingAndRadioIdRequest, Offer[] | null> {
    constructor(private _dataOffersCustomerService: DataOffersCustomerService, private _store: Store) {}

    build(offersCustomerRequest: OffersCustomerRequest | OffersCustomerWithBrandingAndRadioIdRequest): Observable<Offer[] | null> {
        return this._dataOffersCustomerService.getCustomerOffers(offersCustomerRequest).pipe(
            tap(offers => {
                this._store.dispatch(behaviorEventReactionFirstOfferDevicePromoCode({ devicePromoCode: offers?.[0]?.promoCode }));
                this._store.dispatch(
                    behaviorEventReactionForPlansOffered({
                        plansOffered: getOffersPlanCodeAndPrice(offers)
                    })
                );
                this._store.dispatch(behaviorEventReactionOffersMarketType({ marketType: getMarketTypeFromFirstOffer(offers) }));
                this._store.dispatch(setOffers({ offers }));
            })
        );
    }
}
