import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { loadOffersError, setOffers } from '../state/actions/load-offers.actions';
import { Store } from '@ngrx/store';
import { CLIENT_SDK, IClientSDK } from '@de-care/shared/configuration-tokens-client-sdk';

@Injectable({ providedIn: 'root' })
export class LoadOffersAtlasWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, @Inject(CLIENT_SDK) private readonly _clientSDK: IClientSDK) {}

    build(): Observable<boolean> {
        return from(this._clientSDK.offers.retrieveOffers()).pipe(
            map((offers) =>
                offers.map((offer) => {
                    return {
                        planCode: offer.id,
                    };
                })
            ),
            tap((offers) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._store.dispatch(setOffers({ offers }));
            }),
            catchError((error) => {
                this._store.dispatch(loadOffersError({ error }));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
