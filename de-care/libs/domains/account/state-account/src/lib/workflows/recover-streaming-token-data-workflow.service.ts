import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { StreamingTokenDataServiceResponse, StreamingTokenDataServiceRequest, StreamingTokenDataService } from '../data-services/streaming-token-data.service';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { behaviorEventReactionCustomerInfoAuthenticationType } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class RecoverStreamingTokenDataWorkflowService implements DataWorkflow<StreamingTokenDataServiceRequest, StreamingTokenDataServiceResponse> {
    constructor(private readonly _streamingTokenDataService: StreamingTokenDataService, private readonly _store: Store) {}

    build(request: StreamingTokenDataServiceRequest): Observable<StreamingTokenDataServiceResponse> {
        return this._streamingTokenDataService
            .getStreamingTokenData(request)
            .pipe(tap(_ => this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKENIZED_ENTRY' }))));
    }
}
