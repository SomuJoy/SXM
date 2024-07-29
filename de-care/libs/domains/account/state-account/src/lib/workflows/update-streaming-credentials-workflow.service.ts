import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataAccountNonPiiService } from '../data-services/data-account-non-pii.service';
import { DataAccountUpdateStreamingCredentialsService } from '../data-services/data-account-update-streaming-credentials.service';
import { tap, catchError, concatMap, mapTo } from 'rxjs/operators';
import { behaviorEventReactionClosedDevicesInfo, behaviorEventReactionStreamingCredentialsUpdated } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { setAccount, setEmailId, setMarketingAccountId } from '../state/actions';

export interface SetStreamingCredentialsWorkflowRequest {
    radioId?: string;
    username?: string;
    password?: string;
    email?: string;
    synchronizeAccountEmail?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UpdateStreamingCredentialsWorkflowService implements DataWorkflow<SetStreamingCredentialsWorkflowRequest, boolean> {
    constructor(
        private readonly _dataAccountNonPiiService: DataAccountNonPiiService,
        private readonly _dataAccountUpdateStreamingCredentialsService: DataAccountUpdateStreamingCredentialsService,
        private readonly _store: Store
    ) {}

    build(request: SetStreamingCredentialsWorkflowRequest): Observable<boolean> {
        // Microservice requires an account endpoint call prior to the streaming credentials call
        return this._dataAccountNonPiiService.getAccount({ radioId: request.radioId }).pipe(
            concatMap((nonPiiResponse) => this._dataAccountUpdateStreamingCredentialsService.update(request).pipe(mapTo(nonPiiResponse))),
            tap((nonPiiResponse) => {
                // store non pii response data in state
                this._store.dispatch(setMarketingAccountId({ marketingAccountId: nonPiiResponse.marketingAcctId }));
                this._store.dispatch(setEmailId({ email: nonPiiResponse.email }));
                this._store.dispatch(setAccount({ account: nonPiiResponse.nonPIIAccount }));

                this._store.dispatch(behaviorEventReactionStreamingCredentialsUpdated());
                if (nonPiiResponse?.nonPIIAccount?.closedDevices?.length > 0) {
                    this._store.dispatch(
                        behaviorEventReactionClosedDevicesInfo({
                            closedDevices: nonPiiResponse?.nonPIIAccount?.closedDevices?.map((d) => {
                                return { dateClosed: d.closedDate, esnLast4Digits: d.last4DigitsOfRadioId };
                            }),
                        })
                    );
                }
            }),
            mapTo(true),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
