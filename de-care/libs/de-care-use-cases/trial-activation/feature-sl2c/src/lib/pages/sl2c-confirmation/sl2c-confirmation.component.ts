import { behaviorEventImpressionForPage, behaviorEventReactionRefreshSignalBySignal, behaviorEventReactionRefreshSignalByText } from '@de-care/shared/state-behavior-events';
import { Component, OnInit } from '@angular/core';
import {
    getExpiryDate,
    getLast4digitsOfRadioId,
    getProvinceIsQuebec,
    setProvinceSelectionDisabled,
    setProvinceSelectionVisibleIfCanada,
    getDateFormat,
    getLanguage,
    getFirstSubscriptionID,
} from '@de-care/de-care-use-cases/trial-activation/state-sl2c';
import { select, Store } from '@ngrx/store';
import { ComponentNameEnum, DataLayerActionEnum } from '@de-care/data-services';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-care-trial-activation-sl2c-confirmation',
    templateUrl: './sl2c-confirmation.component.html',
    styleUrls: ['./sl2c-confirmation.component.scss'],
})
export class DeCareUseCasesTrialActivationSl2CConfirmationComponent implements OnInit {
    radioId$ = this._store.pipe(select(getLast4digitsOfRadioId));
    trialEndDate$ = this._store.pipe(select(getExpiryDate));
    isQuebec$ = this._store.pipe(select(getProvinceIsQuebec));
    dateFormat$ = this._store.pipe(select(getDateFormat));
    locale$ = this._store.pipe(select(getLanguage));
    subscriptionID$ = this._store.select(getFirstSubscriptionID);

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));
        this._store.dispatch(setProvinceSelectionDisabled({ isDisabled: true }));
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'trial_activation', componentKey: 'SL2C_confirmation' }));
    }
}
