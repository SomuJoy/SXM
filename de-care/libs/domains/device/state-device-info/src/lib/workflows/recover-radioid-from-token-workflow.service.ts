import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { DeviceRadioIdTokenService } from '../data-services/device-radioid-token.service';
import { catchError, map } from 'rxjs/operators';

interface RecoverRadioIdFromTokenWorkflowRequest {
    token: string;
}

export interface RecoverRadioIdFromTokenWorkflowResponse {
    last4DigitsOfRadioId: string;
}

@Injectable({ providedIn: 'root' })
export class RecoverRadioIdFromTokenWorkflowService implements DataWorkflow<RecoverRadioIdFromTokenWorkflowRequest, RecoverRadioIdFromTokenWorkflowResponse | null> {
    constructor(private readonly _deviceRadioIdTokenService: DeviceRadioIdTokenService) {}

    build(token: RecoverRadioIdFromTokenWorkflowRequest): Observable<RecoverRadioIdFromTokenWorkflowResponse | null> {
        return this._deviceRadioIdTokenService.getRadioIdFromToken(token).pipe(
            catchError(() => {
                return of(null);
            })
        );
    }
}
