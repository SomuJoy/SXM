import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { RegisterWorkflowService } from '@de-care/domains/account/state-account';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Request {
    securityQuestions: {
        id?: number;
        answer?: string;
    }[];
}

@Injectable({ providedIn: 'root' })
// TODO: look to move this to state-common lib for checkout so we can use it across different features
export class SubmitAccountRegistrationWorkflowService implements DataWorkflow<Request, boolean> {
    constructor(private readonly _registerWorkflowService: RegisterWorkflowService) {}

    build(request: Request): Observable<boolean> {
        return this._registerWorkflowService.build({ registrationData: request }).pipe(
            map((result) => {
                if (result.status !== 'SUCCESS') {
                    throw {
                        error: result,
                    };
                }
                return true;
            })
        );
    }
}
