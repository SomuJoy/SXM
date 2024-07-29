import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { NuCaptchaValidateRequestModel, ValidateNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';

@Injectable({
    providedIn: 'root'
})
export class LegacyValidateNucaptchaAnswerWorkflowService implements DataWorkflow<NuCaptchaValidateRequestModel, boolean> {
    constructor(private readonly _validateNucaptchaWorkflowService: ValidateNucaptchaWorkflowService) {}

    build(request: NuCaptchaValidateRequestModel) {
        return this._validateNucaptchaWorkflowService.build(request);
    }
}
