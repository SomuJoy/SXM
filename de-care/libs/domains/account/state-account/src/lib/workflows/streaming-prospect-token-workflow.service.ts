import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { StreamingProspectTokenDataService } from '../data-services/streaming-prospect-token-data.service';
import { StreamingProspectTokenDataServiceResponse, StreamingProspectTokenPayload } from '../data-services/streaming-prospect-token-data.interface';

@Injectable({
    providedIn: 'root',
})
export class StreamingProspectTokenWorkflowService implements DataWorkflow<StreamingProspectTokenPayload, StreamingProspectTokenDataServiceResponse> {
    constructor(private readonly _streamingProspectTokenDataService: StreamingProspectTokenDataService) {}

    build(request: StreamingProspectTokenPayload) {
        return this._streamingProspectTokenDataService.getStreamingProspectTokenData(request);
    }
}
