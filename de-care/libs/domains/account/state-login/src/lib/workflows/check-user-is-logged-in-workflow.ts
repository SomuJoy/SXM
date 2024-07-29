import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class CheckUserIsLoggedInWorkflow implements DataWorkflow<null, boolean> {
    constructor(private readonly _cookieService: CookieService) {}

    build(): Observable<boolean> {
        const sxmLoggedInCookie = this._cookieService.get('SXM_C_R');
        return of(sxmLoggedInCookie ? true : false);
    }
}
