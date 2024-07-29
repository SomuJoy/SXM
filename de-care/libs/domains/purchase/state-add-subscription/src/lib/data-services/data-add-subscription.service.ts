import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import { AddSubscriptionResponse, AddSubscriptionRequest } from './add-subscription.interface';

const ENDPOINT_URL = '/purchase/add-subscription';

@Injectable({ providedIn: 'root' })
export class DataAddSubscriptionService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    addSubscription(request: AddSubscriptionRequest, allowErrorHandler: boolean = true): Observable<AddSubscriptionResponse> {
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString()
            }
        };
        return this._http.post<MicroservicesResponse<AddSubscriptionResponse>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data));
    }
}
