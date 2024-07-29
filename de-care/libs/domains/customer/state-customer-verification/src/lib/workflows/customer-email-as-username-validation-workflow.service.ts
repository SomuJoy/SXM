import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomerInfoValidationService } from '../data-services/customer-info-validation.service';
import { map, tap } from 'rxjs/operators';

interface CustomerEmailAsUsernameValidationWorkflowRequest {
    email: string;
    isForStreaming: boolean;
    reuseUsername: boolean;
}
export type CustomerEmailAsUsernameValidationWorkflowErrors = 'EMAIL_IN_USE_AS_USERNAME' | 'EMAIL_INVALID';

@Injectable({ providedIn: 'root' })
export class CustomerEmailAsUsernameValidationWorkflowService implements DataWorkflow<CustomerEmailAsUsernameValidationWorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _customerInfoValidationService: CustomerInfoValidationService) {}

    build(request: CustomerEmailAsUsernameValidationWorkflowRequest): Observable<boolean> {
        return this._customerInfoValidationService
            .validate({
                email: { email: request.email, streaming: request.isForStreaming },
                username: { userName: request.email, reuseUserName: request.reuseUsername },
            })
            .pipe(
                tap((response) => {
                    // TODO: add behavior tracking here
                }),
                map((response) => {
                    if (response.emailValidation.valid && response.usernameValidation.valid) {
                        return true;
                    } else {
                        if (!response.usernameValidation.valid) {
                            throw 'EMAIL_IN_USE_AS_USERNAME' as CustomerEmailAsUsernameValidationWorkflowErrors;
                        } else {
                            throw 'EMAIL_INVALID' as CustomerEmailAsUsernameValidationWorkflowErrors;
                        }
                    }
                })
            );
    }
}
