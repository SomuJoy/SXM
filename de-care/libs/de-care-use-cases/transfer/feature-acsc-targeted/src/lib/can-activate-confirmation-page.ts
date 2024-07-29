import { Injectable, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { getAccountRegistered } from '@de-care/domains/account/state-account';
import { selectHasStateDataForConfirmationPage } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class CanActivateConfirmationPage implements CanActivate {
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) document: Document, private readonly _store: Store<any>, private readonly _settingsService: SettingsService) {
        this._window = document && document.defaultView;
    }

    canActivate(): Observable<boolean> {
        return this._store.pipe(
            select(selectHasStateDataForConfirmationPage),
            take(1),
            withLatestFrom(this._store.pipe(select(getAccountRegistered))),
            map(([hasStateData, accountRegistered]) => {
                if (hasStateData) {
                    this._store.dispatch(fetchSecurityQuestions({ accountRegistered }));
                    return true;
                } else {
                    this._window && (this._window.location.href = this._settingsService.settings.oacUrl);
                    return false;
                }
            })
        );
    }
}
