import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { DataAccountUpdateStreamingCredentialsService } from '../data-services/data-account-update-streaming-credentials.service';

interface WorkflowRequest {
    radioId: string;
    password: string;
    synchronizeAccountEmail?: boolean;
    username?: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateStreamingCredentialsService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _dataAccountUpdateStreamingCredentialsService: DataAccountUpdateStreamingCredentialsService) {}

    build(request: WorkflowRequest): Observable<boolean> {
        const usernameIsEmail = request.username.indexOf('@') > -1;
        // TODO: determine what we need to do for the email field:
        //       - do we need to require email and it is up to the caller to send that along, whether they want it to be the same as username or in addition to?
        return this._dataAccountUpdateStreamingCredentialsService
            .update({
                ...request,
                ...(usernameIsEmail ? { email: request.username } : { username: request.username }),
            })
            .pipe(
                // TODO: add behavior event tracking here
                mapTo(true)
            );
    }
}
