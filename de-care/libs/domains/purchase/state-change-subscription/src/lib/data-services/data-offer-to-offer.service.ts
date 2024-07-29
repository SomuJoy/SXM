import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroservicesResponse } from './microservice-response.interface';
import { OfferToOfferRequest, OfferToOfferResponse } from './offer-to-offer.interface';

const ENDPOINT_URL = '/purchase/offer2offer';

@Injectable({ providedIn: 'root' })
export class DataOfferToOfferService {
    private _url: string;

    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    offerToOffer(request: OfferToOfferRequest): Observable<OfferToOfferResponse> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<OfferToOfferResponse>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(map(response => response.data));
    }
}
