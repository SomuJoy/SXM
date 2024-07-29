import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { getQueryParamsForCheckoutRedirect } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { delay, first, map, take } from 'rxjs/operators';

@Component({
    selector: 'de-redirect-fallback-page',
    templateUrl: './redirect-fallback-page-component.html',
    styleUrls: ['./redirect-fallback-page-component.scss'],
})
export class RedirectFallbackPageComponent implements AfterViewInit {
    private _redirectQueryParams$ = this._store.pipe(select(getQueryParamsForCheckoutRedirect));
    errorCode$ = this._redirectQueryParams$.pipe(map((queryParams) => queryParams?.errorCode));

    constructor(private readonly _store: Store, private readonly _router: Router) {}

    ngAfterViewInit() {
        this._redirectQueryParams$.pipe(delay(5000), take(1), first()).subscribe((queryParams) => {
            this._router.navigate(['/subscribe/checkout'], { queryParams });
        });
    }

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }
}
