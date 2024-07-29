import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiPrefix } from '@de-care/shared/state-settings';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import { Sl2cSubmissionRequestInterface, Sl2cSubmissionResponseInterface } from './sl2c-submission.interface';

const ENDPOINT_URL = '/trial-activation/service-lane-two-click';

@Injectable({ providedIn: 'root' })
export class Sl2cSubmissionService {
    constructor(private readonly _http: HttpClient, private readonly _store: Store) {}

    submit(customerInfo: Sl2cSubmissionRequestInterface): Observable<Sl2cSubmissionResponseInterface> {
        const options = { withCredentials: true };
        return this._store.pipe(
            select(getApiPrefix),
            take(1),
            concatMap(url => this._http.post<MicroservicesResponse<Sl2cSubmissionResponseInterface>>(`${url}${ENDPOINT_URL}`, customerInfo, options)),
            map(response => {
                return response.data;
            })
        );
    }
}
