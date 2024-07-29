import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams, getRouteSegments } from '@de-care/shared/state-router-store';
import { map, take, delay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'ineligible-error-page',
    templateUrl: './ineligible-error-page.component.html',
    styleUrls: ['./ineligible-error-page.component.scss'],
})
export class IneligibleErrorPageComponent implements OnInit {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    translateKey = 'checkout.ineligibleErrorPageComponent.';

    errorCode$ = this._store.select(getNormalizedQueryParams).pipe(map(({ errorcode }) => errorcode as string));
    routeUseCase$ = this._store.select(getRouteSegments);
    programCode$ = this._store.select(getNormalizedQueryParams).pipe(map(({ programcode }) => programcode as string));
    promocode$ = this._store.select(getNormalizedQueryParams).pipe(map(({ promocode }) => promocode as string));
    upcode$ = this._store.select(getNormalizedQueryParams).pipe(map(({ upcode }) => upcode as string));
    langpref$ = this._store.select(getNormalizedQueryParams).pipe(map(({ langpref }) => langpref as string));

    ngOnInit() {
        this._redirect();
    }

    private _redirect() {
        combineLatest([this.routeUseCase$, this.errorCode$, this.programCode$, this.promocode$, this.upcode$, this.langpref$])
            .pipe(delay(5000), take(1))
            .subscribe(([routeSegments, errorCode, programCode, promocode, upcode, langpref]) => {
                return this._router.navigate(['subscribe', 'checkout', routeSegments[3]], { queryParams: { errorCode, programCode, promocode, upcode, langpref } });
            });
    }
}
