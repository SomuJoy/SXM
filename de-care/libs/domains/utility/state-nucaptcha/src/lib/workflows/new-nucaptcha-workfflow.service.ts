import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataNucaptchaService } from '../data-services/data-nucaptcha.service';
import { NuCaptchaNewRequestModel } from '../data-services/nu-captcha.model';

@Injectable({ providedIn: 'root' })
export class NewNucaptchaWorkflowService implements DataWorkflow<NuCaptchaNewRequestModel, string> {
    constructor(private readonly _dataNucaptchaService: DataNucaptchaService) {}

    build(request: NuCaptchaNewRequestModel): Observable<string> {
        return this._dataNucaptchaService.new(request).pipe(map(data => data.captcha));
    }
}
