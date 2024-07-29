import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { StreamingProspectTokenDataServiceResponse, StreamingProspectTokenPayload } from './streaming-prospect-token-data.interface';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';
const ENDPOINT_URL = '/account/token/streaming';

@Injectable({ providedIn: 'root' })
export class StreamingProspectTokenDataService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    getStreamingProspectTokenData(request: StreamingProspectTokenPayload) {
        const token = request.token;
        const tokenType = request.tokenType;
        const options = {
            withCredentials: true,
        };
        return this._post<
            {
                token: string;
                tokenType: string;
            },
            StreamingProspectTokenDataServiceResponse,
            null,
            null
        >(
            `${this._apiUrl}${ENDPOINT_URL}`,
            {
                token,
                tokenType,
            },
            options
        );
    }
}
