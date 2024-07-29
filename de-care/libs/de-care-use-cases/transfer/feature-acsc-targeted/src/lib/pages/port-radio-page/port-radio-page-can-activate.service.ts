import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    getDataForLoadQuotes,
    getHasStateDataForPortRadio,
    setPaymentTypeAsInvoice,
    setPaymentTypeAsCreditCard,
    getPaymentTypeFromAccount,
    setPaymentMethodAsCardOnFile,
    setPaymentMethodAsNotCardOnFile,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { catchError, concatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { LoadACSCQuoteWorkflowService } from '@de-care/domains/quotes/state-quote';
import { behaviorEventErrorFromHttpCall } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class PortRadioPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store, private readonly _loadACSCQuoteWorkflowService: LoadACSCQuoteWorkflowService) {}
    canActivate(): Observable<boolean | UrlTree> {
        return this._store.select(getHasStateDataForPortRadio).pipe(
            map((hasStateData) => {
                if (hasStateData) {
                    return true;
                } else {
                    throwError('no state data');
                }
            }),
            withLatestFrom(this._store.select(getPaymentTypeFromAccount)),
            tap(([, paymentType]) => {
                // need to set paymentType before selecting request data for quote call
                switch (paymentType) {
                    case 'invoice':
                        this._store.dispatch(setPaymentTypeAsInvoice());
                        break;
                    case 'creditCard':
                        this._store.dispatch(setPaymentTypeAsCreditCard());
                        this._store.dispatch(setPaymentMethodAsCardOnFile());
                        break;
                    case 'none':
                        this._store.dispatch(setPaymentTypeAsCreditCard());
                        this._store.dispatch(setPaymentMethodAsNotCardOnFile());
                }
            }),
            withLatestFrom(this._store.select(getDataForLoadQuotes)),
            concatMap(([, request]) => {
                return this._loadACSCQuoteWorkflowService.build(request).pipe(
                    catchError((error) => {
                        this._store.dispatch(behaviorEventErrorFromHttpCall({ error }));
                        return throwError(error);
                    })
                );
            }),
            catchError(() => {
                return of(this._router.createUrlTree(['/error']));
            })
        );
    }
}
