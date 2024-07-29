import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VerifyPhoneService } from '../data-services/verify-phone.service';

export enum VerifyPhoneWorkflowStatus {
    'success' = 'success',
    'fail' = 'fail'
}

@Injectable({ providedIn: 'root' })
export class VerifyPhoneWorkFlowService implements DataWorkflow<{ phoneNumber: string }, VerifyPhoneWorkflowStatus> {
    constructor(private readonly _verifyPhoneService: VerifyPhoneService) {}

    build({ phoneNumber }) {
        return this._verifyPhoneService.authenticationVerifyPhone({ phoneNumber }).pipe(
            map(({ status }) => (status ? VerifyPhoneWorkflowStatus.success : VerifyPhoneWorkflowStatus.fail)),
            catchError(() => of(VerifyPhoneWorkflowStatus.fail))
        );
    }
}
