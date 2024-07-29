import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataNucaptchaService } from '../data-services/data-nucaptcha.service';
import { NuCaptchaValidateRequestModel } from '../data-services/nu-captcha.model';

@Injectable({ providedIn: 'root' })
export class ValidateNucaptchaWorkflowService implements DataWorkflow<NuCaptchaValidateRequestModel, boolean> {
    constructor(private readonly _dataNucaptchaService: DataNucaptchaService) {}

    build(request: NuCaptchaValidateRequestModel): Observable<boolean> {
        return this._dataNucaptchaService.validate(request).pipe(map(data => data.isValidCaptcha));
    }
}
