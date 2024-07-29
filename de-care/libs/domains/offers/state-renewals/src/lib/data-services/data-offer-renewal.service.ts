import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MicroservicesResponse } from './microservice-response.interface';
import { OfferRenewalRequest, Offer } from './offer-renewal.interface';

const ENDPOINT_URL = '/offers/renewal';

@Injectable({ providedIn: 'root' })
export class DataOfferRenewalService {
    private readonly _url: string;

    constructor(private readonly _http: HttpClient, private readonly settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getOfferRenewal(request: OfferRenewalRequest): Observable<Offer[]> {
        const options = { withCredentials: true };

        return this._http.post<MicroservicesResponse<{ offers: Offer[] }>>(`${this._url}${ENDPOINT_URL}`, request, options).pipe(
            map(response => {
                return response.data.offers;
            })
        );
    }
}
