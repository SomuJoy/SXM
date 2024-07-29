import { InjectionToken, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { MicroservicesResponse } from '@de-care/data-services';
import { map } from 'rxjs/operators';

export const Amazon = new InjectionToken<any>('AMAZON_OBJECT');
//represents the amazon object from the document
export const AMAZON_OBJECT_KEY = 'amazon';
export const endpointURL = '/authenticate/linking/amazon';

@Injectable({ providedIn: 'root' })
export class AmazonLoginService {
    private url: string;
    //use DI to inject the amazon object in runtime
    constructor(@Inject(Amazon) private _amazon, private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    setClientId(clientId: string) {
        this._amazon.Login.setClientId(clientId);
    }

    authorize(options: any, response: any): any {
        return this._amazon.Login.authorize(options, response);
    }

    authenticate(params: any): Observable<any> {
        const options = { withCredentials: true };

        return this._http.post<MicroservicesResponse<any>>(`${this.url}${endpointURL}`, params, options).pipe(
            map(response => {
                console.log('amz serv', response);
                return response.data;
            })
        );
    }
}
