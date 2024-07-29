import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RecoverPasswordFromPhoneService } from '../data-services/recover-password-from-phone.service';

export interface RecoverPasswordFromPhoneWorkflowRequest {
    accountLoginCredentials?: boolean;
    setResetKey?: boolean;
    phoneNo?: number;
    sxmUsername?: string;
    subscriptionId?: any;
    langPref?: string;
}

@Injectable({ providedIn: 'root' })
export class RecoverPasswordFromPhoneWorkflowService implements DataWorkflow<RecoverPasswordFromPhoneWorkflowRequest, boolean> {
    constructor(private readonly _recoverPasswordFromPhoneService: RecoverPasswordFromPhoneService) {}

    build(request: RecoverPasswordFromPhoneWorkflowRequest): Observable<any> {
        return this._recoverPasswordFromPhoneService.getAccount(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
