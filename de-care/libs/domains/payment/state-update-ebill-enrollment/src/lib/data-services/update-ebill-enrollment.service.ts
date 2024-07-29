import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
import { Observable } from 'rxjs';

export interface UpdateEbillEnrollmentRequest {
    email?: string;
    ebillEnrollment: boolean;
}

export interface UpdateEbillEnrollmentResponse {
    status: string;
}

type ActionErrorCodes = '';
type FieldErrorCodes = '';

const ENDPOINT_URL = '/payment/update-ebill-enrollment';

@Injectable({ providedIn: 'root' })
export class UpdateEbillEnrollmentService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    build(request: UpdateEbillEnrollmentRequest): Observable<UpdateEbillEnrollmentResponse> {
        const options = { withCredentials: true };
        return this._post<UpdateEbillEnrollmentRequest, UpdateEbillEnrollmentResponse, ActionErrorCodes, FieldErrorCodes>(`${this._apiUrl}${ENDPOINT_URL}`, request, options);
    }
}
