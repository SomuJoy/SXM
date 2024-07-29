import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ValidateEmailService } from '../data-services/validate-email.service';

export enum ValidateEmailWorkflowStatus {
    'success' = 'success',
    'fail' = 'fail'
}

@Injectable({ providedIn: 'root' })
export class ValidateEmailWorkFlowService implements DataWorkflow<{ email: string }, ValidateEmailWorkflowStatus> {
    constructor(private readonly _validateEmailService: ValidateEmailService) {}

    build({ email }) {
        return this._validateEmailService.submit({ email }).pipe(
            map(status => (status ? ValidateEmailWorkflowStatus.success : ValidateEmailWorkflowStatus.fail)),
            catchError(() => of(ValidateEmailWorkflowStatus.fail))
        );
    }
}
