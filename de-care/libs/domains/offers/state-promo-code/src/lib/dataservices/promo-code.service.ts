import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ALLOW_ERROR_HANDLER_HEADER, SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PromoCodeValidateResponse, MicroservicesResponse } from './promo-code.interface';

@Injectable({ providedIn: 'root' })
export class PromoCodeService {
    private readonly _url = `${this.settingsService.settings.apiUrl}${this.settingsService.settings.apiPath}`;
    private readonly _validatePromoCodeUrl = `${this._url}/offers/promocode/validate`;

    constructor(private _http: HttpClient, private readonly settingsService: SettingsService) {}

    validatePromoCode(payload: { marketingPromoCode: string; streaming: boolean }, allowErrorHandler: boolean = true): Observable<PromoCodeValidateResponse> {
        const options = {
            withCredentials: true,
            ...(allowErrorHandler && {
                headers: {
                    [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString()
                }
            })
        };
        return this._http.post<MicroservicesResponse<PromoCodeValidateResponse>>(this._validatePromoCodeUrl, payload, options).pipe(
            map(response => {
                return response.data;
            })
        );
    }
}
