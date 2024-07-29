import { Injectable } from '@angular/core';
import { RecoverPasswordFromPhoneWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface RecoverPasswordFromPhoneWorkflowRequest {
    accountLoginCredentials?: any;
    setResetKey?: any;
    phoneNo?: any;
    sxmUsername?: any;
    subscriptionId?: any;
    langPref?: string;
}

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromPhoneWorkflowServices implements DataWorkflow<RecoverPasswordFromPhoneWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromPhoneService: RecoverPasswordFromPhoneWorkflowService) {}

    build(request: RecoverPasswordFromPhoneWorkflowRequest): Observable<any> {
        return this._recoverPasswordFromPhoneService.build(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
