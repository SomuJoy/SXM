import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getSelectedProvinceCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { DataOffersCustomerAddService, getAllOffersAsArray, getMarketTypeFromFirstOffer, getOffersPlanCodeAndPrice, setOffers } from '@de-care/domains/offers/state-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import {
    behaviorEventReactionFirstOfferDevicePromoCode,
    behaviorEventReactionForPlansOffered,
    behaviorEventReactionOffersMarketType,
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';
import { setSelectedPlanCode } from '../state/public.actions';
import { getSelectedRadioId } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class LoadOffersCustomerForAddRadioWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _dataOffersCustomerAddService: DataOffersCustomerAddService,
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService
    ) {}

    build() {
        return this._store.select(getSelectedRadioId).pipe(
            take(1),
            concatMap((radioId) =>
                this._dataOffersCustomerAddService.offersToAdd({ radioId }).pipe(
                    tap(({ offers }) => {
                        this._store.dispatch(behaviorEventReactionFirstOfferDevicePromoCode({ devicePromoCode: offers?.[0]?.promoCode }));
                        this._store.dispatch(
                            behaviorEventReactionForPlansOffered({
                                plansOffered: getOffersPlanCodeAndPrice(offers),
                            })
                        );
                        this._store.dispatch(behaviorEventReactionOffersMarketType({ marketType: getMarketTypeFromFirstOffer(offers) }));
                        this._store.dispatch(setOffers({ offers: offers.filter((offer) => offer.termLength === 1 || offer.type === 'PROMO') }));
                        this._store.dispatch(setSelectedPlanCode({ planCode: offers.find((offer) => offer.bestPackage).planCode }));
                    }),
                    withLatestFrom(this._store.select(getAllOffersAsArray), this._store.select(getSelectedProvinceCode)),
                    map(([_, offers, province]) => ({
                        planCodes: offers.map((offer) => ({ leadOfferPlanCode: offer.planCode })),
                        radioId,
                        ...(province ? { province } : {}),
                    })),
                    concatMap((payload) => this._loadOffersInfoWorkflowService.build(payload)),
                    catchError(() => of(this._router.createUrlTree(['/error']))),
                    mapTo(true)
                )
            )
        );
    }
}
