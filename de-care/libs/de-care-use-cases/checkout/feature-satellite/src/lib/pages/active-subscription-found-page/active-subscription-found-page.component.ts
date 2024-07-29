import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getRadioInfoForActiveSubscriptionViewModel } from '@de-care/de-care-use-cases/checkout/state-satellite';

@Component({
    selector: 'active-subscription-found-page',
    templateUrl: './active-subscription-found-page.component.html',
    styleUrls: ['./active-subscription-found-page.component.scss'],
})
export class ActiveSubscriptionFoundPageComponent {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureSatelliteModule.ActiveSubscriptionFoundPageComponent.';
    activeSubscriptionViewModel$ = this._store.select(getRadioInfoForActiveSubscriptionViewModel);

    constructor(private readonly _store: Store) {}
}
