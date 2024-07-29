import { AfterViewInit, Component, OnInit } from '@angular/core';
import { finishPageLoading } from '@de-care/de-care-use-cases/checkout/state-upgrade';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-care-expired-error-page',
    templateUrl: './expired-error-page.component.html',
    styleUrls: ['./expired-error-page.component.scss'],
})
export class ExpiredErrorPageComponent implements OnInit, AfterViewInit {
    readonly translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeModule.ExpiredErrorPageComponent.';

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(finishPageLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'Expired' }));
    }
}
