import { HttpClient, HttpHeaders, HttpContext, HttpParams } from '@angular/common/http';
import { pipe, throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MicroservicesResponse, MicroservicesResponseErrorModel } from './microservice-response.interface';

// This is an interface to represent the HttpClient get/post method options parameter which doesn't have an interface
//  that we can import from '@angular/common/http'. If it ever gets one we can replace this one with an import of that.
interface HttpRequestOptions {
    headers?:
        | HttpHeaders
        | {
              [header: string]: string | string[];
          };
    context?: HttpContext;
    observe?: 'body';
    params?:
        | HttpParams
        | {
              [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export abstract class MicroservicesEndpointService {
    protected constructor(protected readonly _apiUrl: string, private readonly _http: HttpClient) {}

    protected _get<ResponseDataType, ActionErrorCodeTypes, FieldErrorCodeTypes>(url: string, options?: HttpRequestOptions): Observable<ResponseDataType> {
        return this._http.get<MicroservicesResponse<ResponseDataType>>(url, options).pipe(this._mapResponse<ResponseDataType, ActionErrorCodeTypes, FieldErrorCodeTypes>());
    }

    protected _post<RequestDataType, ResponseDataType, ActionErrorCodeTypes, FieldErrorCodeTypes>(
        url: string,
        body: RequestDataType,
        options?: HttpRequestOptions
    ): Observable<ResponseDataType> {
        return this._http
            .post<MicroservicesResponse<ResponseDataType>>(url, body, options)
            .pipe(this._mapResponse<ResponseDataType, ActionErrorCodeTypes, FieldErrorCodeTypes>());
    }

    protected _mapResponse<ResponseDataType, ActionErrorCodeTypes, FieldErrorCodeTypes>() {
        return pipe(
            map<MicroservicesResponse<ResponseDataType>, ResponseDataType>((response) => response.data),
            catchError((error: MicroservicesResponseErrorModel<ActionErrorCodeTypes, FieldErrorCodeTypes>) => throwError(error.error.error))
        );
    }
}
