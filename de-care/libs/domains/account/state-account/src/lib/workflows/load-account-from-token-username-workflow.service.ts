import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { AccountFromTokenModel } from '../data-services/account-from-token.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataAccountTokenUsernameService } from '../data-services/data-account-token-username.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LoadAccountFromTokenUsernameWorkflowService implements DataWorkflow<{ token: string; allowErrorHandler: boolean }, AccountFromTokenModel> {
    constructor(private _dataAccountTokenUsernameService: DataAccountTokenUsernameService) {}

    build({ token }): Observable<any> {
        return this._dataAccountTokenUsernameService.getAccountFromToken(token).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}
