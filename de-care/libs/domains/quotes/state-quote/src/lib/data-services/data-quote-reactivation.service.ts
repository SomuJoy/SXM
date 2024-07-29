import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuoteModel } from './quote.interface';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/quotes/reactivation-quote';

@Injectable({ providedIn: 'root' })
export class DataQuoteReactivationService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    reactivateQuote(): Observable<QuoteModel> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<{ quote: QuoteModel }>>(`${this._url}${ENDPOINT_URL}`, {}, options).pipe(
            map((response) => {
                return response.data.quote;
            })
        );
    }
}
