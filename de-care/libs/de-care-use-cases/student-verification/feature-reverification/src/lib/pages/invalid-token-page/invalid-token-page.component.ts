import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { getOACLoginRedirectUrl, pageDataFinishedLoading } from '@de-care/de-care-use-cases/student-verification/state-reverification';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'de-care-invalid-token-page',
    templateUrl: './invalid-token-page.component.html',
    styleUrls: ['./invalid-token-page.component.scss'],
})
export class InvalidTokenPageComponent implements OnInit, OnDestroy {
    translateKeyPrefix = 'deCareUseCasesStudentVerificationFeatureReverification.invalidTokenPageComponent';

    private readonly _window: Window;
    private _destroy$ = new Subject<boolean>();
    private oacRedirectUrl: string;
    constructor(@Inject(DOCUMENT) private readonly _document: Document, private _store: Store) {
        this._window = this._document && this._document.defaultView;
    }
    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    ngOnInit() {
        this._store.pipe(select(getOACLoginRedirectUrl), takeUntil(this._destroy$)).subscribe((oacRedirectUrl) => {
            this.oacRedirectUrl = oacRedirectUrl;
        });
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'authentication', componentKey: 'OopsWarningPageSignIn' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    redirectToLogin() {
        this._window && (this._window.location.href = this.oacRedirectUrl);
    }
}
