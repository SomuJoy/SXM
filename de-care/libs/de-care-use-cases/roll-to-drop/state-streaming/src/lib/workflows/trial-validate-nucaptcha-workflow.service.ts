import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { NuCaptchaValidateRequestModel, ValidateNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';
import { setCaptchaValidationNonProcessing, setCaptchaValidationProcessing } from '../state/actions';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TrialValidateNucaptchaWorkflowService implements DataWorkflow<NuCaptchaValidateRequestModel, boolean> {
    constructor(private readonly _store: Store, private readonly _validateNucaptchaWorkflowService: ValidateNucaptchaWorkflowService) {}

    build(request: NuCaptchaValidateRequestModel) {
        this._store.dispatch(setCaptchaValidationProcessing());
        return this._validateNucaptchaWorkflowService.build(request).pipe(tap(() => this._store.dispatch(setCaptchaValidationNonProcessing())));
    }
}
