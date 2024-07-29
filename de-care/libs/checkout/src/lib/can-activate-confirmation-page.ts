import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { getAccountRegistered, selectHasStateDataForConfirmationPage } from '@de-care/purchase-state';
import { CheckoutNavigationService } from './checkout-navigation.service';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';

@Injectable({ providedIn: 'root' })
export class CanActivateConfirmationPage implements CanActivate {
    constructor(private _store: Store<any>, private _checkoutNavigationService: CheckoutNavigationService) {}

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
                    this._checkoutNavigationService.goToConfirmationPageReloaded();
                    return false;
                }
            })
        );
    }
}
