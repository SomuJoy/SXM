import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import { Cancellation } from './cancellation.interface';
import { catchErrorMapToCustomErrors } from '@de-care/shared/de-microservices-common';

export interface CancelSubscriptionRequest {
    subscriptionId: string;
    inAuthId: string;
}

const ENDPOINT_URL = '/cancel/subscription';

@Injectable({ providedIn: 'root' })
export class DataCancellationService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    cancelSubscription(request: CancelSubscriptionRequest): Observable<Cancellation> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<any>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(
            map(response => response.data),
            catchErrorMapToCustomErrors()
        );
    }
}
