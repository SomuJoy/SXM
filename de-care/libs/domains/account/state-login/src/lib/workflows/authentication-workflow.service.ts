import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticateRequest, AuthenticateResponse, DataAuthenticateService } from '../data-services/data-authenticate.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationWorkflowService implements DataWorkflow<AuthenticateRequest, AuthenticateResponse> {
    constructor(private readonly _dataAuthenticationService: DataAuthenticateService) {}

    build(requestData: AuthenticateRequest): Observable<AuthenticateResponse> {
        return this._dataAuthenticationService.authenticate(requestData).pipe(
            map((response) => {
                return response;
            }),
            catchError((error) => throwError(error))
        );
    }
}
