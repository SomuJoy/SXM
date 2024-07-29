import { Component, OnDestroy } from '@angular/core';
import { userSetLanguage } from '@de-care/domains/customer/state-locale';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    hideHeader$ = new BehaviorSubject(null);
    languageSelectionEnabled$ = this._store.pipe(select(getIsCanadaMode));

    private _unsubscribe: Subject<void> = new Subject();
    constructor(private readonly _store: Store) {
        this._store.pipe(select(getNormalizedQueryParams), takeUntil(this._unsubscribe)).subscribe(({ hideheader }) => {
            if (hideheader !== undefined) {
                this.hideHeader$.next(hideheader.toLowerCase() === 'true');
            }
        });
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
    changeLanguage(lang: string) {
        this._store.dispatch(userSetLanguage({ lang }));
    }
}
