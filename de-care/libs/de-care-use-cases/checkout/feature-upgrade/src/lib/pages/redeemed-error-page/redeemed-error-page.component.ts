import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { finishPageLoading } from '@de-care/de-care-use-cases/checkout/state-upgrade';

@Component({
    selector: 'de-care-redeemed-error-page',
    templateUrl: './redeemed-error-page.component.html',
    styleUrls: ['./redeemed-error-page.component.scss'],
})
export class RedeemedErrorPageComponent implements OnInit, AfterViewInit {
    readonly translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.RedeemedErrorPageComponent.';

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(finishPageLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'Already redeemed' }));
    }
}
