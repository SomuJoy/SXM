import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuoteModel } from './quote.interface';
import { MicroservicesResponse } from './microservice-response.interface';
import { QuoteRequestModel } from './quote-request.interface';

const ENDPOINT_URL = '/quotes/quote';

@Injectable({ providedIn: 'root' })
export class DataQuoteService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    quote(quoteRequestData: QuoteRequestModel): Observable<QuoteModel> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<{ quote: QuoteModel }>>(`${this._url}${ENDPOINT_URL}`, this._normalizeRequestData(quoteRequestData), options).pipe(
            map((response) => {
                return response.data.quote;
            })
        );
    }

    // NOTE: Microservice endpoint requires the serviceAddress.streetAddress property to be on the request model even if the value is not there,
    //       so we will handle normalizing the data before we send it off here so that we don't need to worry about this logic higher up.
    //       Also, it looks like the service that MS calls requires the country code to be upper case, so we will handle that here too.
    private _normalizeRequestData(request: QuoteRequestModel): QuoteRequestModel {
        return {
            ...request,
            ...(request?.serviceAddress
                ? {
                      serviceAddress: {
                          ...request.serviceAddress,
                          streetAddress: request.serviceAddress?.streetAddress || '',
                          country: request.serviceAddress?.country?.toUpperCase() || '',
                      },
                  }
                : {}),
        };
    }
}
