import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { AmazonLoginService } from '@de-care/domains/subscriptions/state-amazon-linking';
import { select, Store } from '@ngrx/store';
import { getAmazonAuthenticateRequestData } from './state/selectors';
import { catchError, concatMap, map, take } from 'rxjs/operators';

export interface LinkDevicePayload {
    code: string;
}

@Injectable({ providedIn: 'root' })
export class LinkDeviceWorkflowService implements DataWorkflow<LinkDevicePayload, boolean> {
    constructor(private readonly _store: Store, private readonly _amazonLoginService: AmazonLoginService) {}

    build({ code }: LinkDevicePayload): Observable<boolean> {
        return this._store.pipe(
            select(getAmazonAuthenticateRequestData),
            take(1),
            concatMap(({ subscriptionId, redirectUri }) => {
                return !subscriptionId
                    ? of(false)
                    : this._amazonLoginService
                          .authenticate({
                              authCode: code,
                              subscriptionId: subscriptionId,
                              redirectUri
                          })
                          .pipe(
                              map(result => result?.status === 'SUCCESS'),
                              catchError(() => of(false))
                          );
            })
        );
    }
}
