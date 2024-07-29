import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { HttpClient } from '@angular/common/http';

const ENDPOINT_URL = '/apigateway/update-usecase';

interface RequestModel {
    useCase: string;
    keepCustomerInfo?: boolean;
    identifiedUser?: boolean;
}

interface ResponseModel {
    status: boolean;
}

type ActionErrorCodes = 'SYSTEM';
type FieldErrorCodes = '';

@Injectable({ providedIn: 'root' })
export class DataUpdateUseCaseService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    updateUseCase(payload: RequestModel): Observable<ResponseModel> {
        return this._post<RequestModel, ResponseModel, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, payload, { withCredentials: true });
    }
}
