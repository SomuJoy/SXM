import { PrepaidRedeemRequest } from './PrepaidRedeemRequest.interface';
import { SettingsService } from '@de-care/settings';
import { MicroServicesResponse } from './micro-service-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

const GIFT_CARD_INFO = '/payment/giftcard/info';
const GIFT_CARD_REMOVE = '/payment/giftcard/remove';

@Injectable({
    providedIn: 'root'
})
export class DataGiftCardService {
    private readonly _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private readonly _http: HttpClient, private readonly _settingsService: SettingsService) {
        this._url = `${_settingsService.settings.apiUrl}${_settingsService.settings.apiPath}`;
    }

    redeemPrepaidCard(request: PrepaidRedeemRequest): Observable<any> {
        const options = { withCredentials: true };
        return this._http.post<MicroServicesResponse<any>>(`${this._url}${GIFT_CARD_INFO}`, request, options).pipe(
            map(response => {
                return response.data;
            }),
            catchError(() =>
                of({
                    error: true,
                    message: 'failed to redeem card'
                })
            )
        );
    }

    removePrepaidCard(): Observable<any> {
        const requestBody: Object = undefined;
        const options = { withCredentials: true };
        return this._http.post<MicroServicesResponse<string>>(`${this._url}${GIFT_CARD_REMOVE}`, requestBody, options).pipe(
            map(response => {
                return response.data;
            }),
            catchError(() =>
                of({
                    error: true,
                    message: 'failed to remove card'
                })
            )
        );
    }
}
